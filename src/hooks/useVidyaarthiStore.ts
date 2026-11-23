import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createUniqueEventId,
  db,
  ensureDemoDataSeeded,
  getAppSetting,
  resetDemoDatabase,
  setAppSetting,
} from '../database/localDatabase';
import { FRACTION_LESSONS } from '../data/lessons/fractionLessons';
import { PRACTICE_EXERCISES } from '../data/exercises/practiceExercises';
import {
  buildStudentAdaptiveSnapshot,
  computeCommonLearningGaps,
} from '../engine/adaptiveEngine';
import {
  computeEffectiveOnline,
  deriveConnectivitySyncState,
} from '../services/offlineService';
import {
  isSupabaseConfigured,
  recordAttemptLocally,
  recordInterventionLocally,
  SyncExecutionResult,
  synchronizePendingQueue,
} from '../services/syncService';
import {
  AttemptPhase,
  AttemptRecord,
  CommonLearningGap,
  FractionConceptId,
  Language,
  MisconceptionId,
  StudentAdaptiveSnapshot,
  StudentProfile,
  SyncQueueItem,
  TeacherIntervention,
} from '../types/domain';
import { useOnlineStatus } from './useOnlineStatus';

export function useVidyaarthiStore() {
  const browserOnline = useOnlineStatus();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [interventions, setInterventions] = useState<TeacherIntervention[]>([]);

  const [activeStudentId, setActiveStudentId] = useState<string>('student-a');
  const [language, setLanguageState] = useState<Language>('en');
  const [simulatedOffline, setSimulatedOfflineState] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<SyncExecutionResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadAllFromDb = useCallback(async () => {
    try {
      await ensureDemoDataSeeded();
      const [
        loadedStudents,
        loadedAttempts,
        loadedQueue,
        loadedInterventions,
        savedStudentId,
        savedLanguage,
        savedSimOffline,
        savedSyncedAt,
      ] = await Promise.all([
        db.students.toArray(),
        db.attempts.toArray(),
        db.syncQueue.toArray(),
        db.interventions.toArray(),
        getAppSetting('activeStudentId'),
        getAppSetting('language'),
        getAppSetting('simulatedOffline'),
        getAppSetting('lastSyncedAt'),
      ]);

      setStudents(loadedStudents);
      setAttempts(loadedAttempts);
      setSyncQueue(loadedQueue);
      setInterventions(loadedInterventions);
      if (savedStudentId && loadedStudents.some((s) => s.id === savedStudentId)) {
        setActiveStudentId(savedStudentId);
      } else if (loadedStudents[0]) {
        setActiveStudentId(loadedStudents[0].id);
      }
      setLanguageState(savedLanguage === 'kn' ? 'kn' : 'en');
      setSimulatedOfflineState(savedSimOffline === 'true');
      setLastSyncedAt(savedSyncedAt);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load local IndexedDB storage.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllFromDb();
  }, [loadAllFromDb]);

  const isEffectiveOnline = computeEffectiveOnline(browserOnline, simulatedOffline);

  const pendingSyncItems = useMemo(
    () => syncQueue.filter((item) => item.status === 'PENDING'),
    [syncQueue]
  );

  const syncState = deriveConnectivitySyncState(isEffectiveOnline, pendingSyncItems.length);

  const studentSnapshots: StudentAdaptiveSnapshot[] = useMemo(() => {
    return students.map((student) =>
      buildStudentAdaptiveSnapshot({
        student,
        attempts,
        lessons: FRACTION_LESSONS,
        exercises: PRACTICE_EXERCISES,
      })
    );
  }, [students, attempts]);

  const activeSnapshot: StudentAdaptiveSnapshot | null = useMemo(() => {
    return (
      studentSnapshots.find((s) => s.student.id === activeStudentId) ??
      studentSnapshots[0] ??
      null
    );
  }, [studentSnapshots, activeStudentId]);

  const commonLearningGaps: CommonLearningGap[] = useMemo(
    () => computeCommonLearningGaps(studentSnapshots),
    [studentSnapshots]
  );

  const switchStudent = useCallback(async (studentId: string) => {
    setActiveStudentId(studentId);
    await setAppSetting('activeStudentId', studentId);
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await setAppSetting('language', lang);
  }, []);

  const toggleSimulatedOffline = useCallback(async (nextOffline?: boolean) => {
    const target = typeof nextOffline === 'boolean' ? nextOffline : !simulatedOffline;
    setSimulatedOfflineState(target);
    await setAppSetting('simulatedOffline', target ? 'true' : 'false');
  }, [simulatedOffline]);

  const logAttempt = useCallback(
    async (input: {
      studentId: string;
      sessionId: string;
      questionId: string;
      conceptId: FractionConceptId;
      selectedOptionId: string;
      isCorrect: boolean;
      misconceptionId?: MisconceptionId;
      phase: AttemptPhase;
    }) => {
      const attempt: AttemptRecord = {
        eventId: createUniqueEventId('att'),
        studentId: input.studentId,
        sessionId: input.sessionId,
        questionId: input.questionId,
        conceptId: input.conceptId,
        selectedOptionId: input.selectedOptionId,
        isCorrect: input.isCorrect,
        misconceptionId: input.misconceptionId,
        phase: input.phase,
        timestamp: new Date().toISOString(),
        syncStatus: 'PENDING',
      };

      await recordAttemptLocally(attempt);
      const [nextAttempts, nextQueue] = await Promise.all([
        db.attempts.toArray(),
        db.syncQueue.toArray(),
      ]);
      setAttempts(nextAttempts);
      setSyncQueue(nextQueue);
      return attempt;
    },
    []
  );

  const logBatchAttempts = useCallback(
    async (
      inputs: Array<{
        studentId: string;
        sessionId: string;
        questionId: string;
        conceptId: FractionConceptId;
        selectedOptionId: string;
        isCorrect: boolean;
        misconceptionId?: MisconceptionId;
        phase: AttemptPhase;
      }>
    ) => {
      const endTime = Date.now();
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const offsetMs = (inputs.length - 1 - i) * 1000;
        const attempt: AttemptRecord = {
          eventId: createUniqueEventId('att'),
          studentId: input.studentId,
          sessionId: input.sessionId,
          questionId: input.questionId,
          conceptId: input.conceptId,
          selectedOptionId: input.selectedOptionId,
          isCorrect: input.isCorrect,
          misconceptionId: input.misconceptionId,
          phase: input.phase,
          timestamp: new Date(endTime - offsetMs).toISOString(),
          syncStatus: 'PENDING',
        };
        await recordAttemptLocally(attempt);
      }
      const [nextAttempts, nextQueue] = await Promise.all([
        db.attempts.toArray(),
        db.syncQueue.toArray(),
      ]);
      setAttempts(nextAttempts);
      setSyncQueue(nextQueue);
    },
    []
  );

  const markInterventionCompleted = useCallback(async (gap: CommonLearningGap) => {
    const intervention: TeacherIntervention = {
      id: `int-${gap.gapKey}`,
      gapKey: gap.gapKey,
      conceptId: gap.conceptId,
      misconceptionId: gap.misconceptionId,
      titleEn: gap.summaryEn,
      titleKn: gap.summaryKn,
      affectedStudentIds: gap.affectedStudentIds,
      recommendedActivityEn: gap.recommendedGroupActivityEn,
      recommendedActivityKn: gap.recommendedGroupActivityKn,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    const eventId = createUniqueEventId('int');
    await recordInterventionLocally(intervention, eventId);
    const [nextInterventions, nextQueue] = await Promise.all([
      db.interventions.toArray(),
      db.syncQueue.toArray(),
    ]);
    setInterventions(nextInterventions);
    setSyncQueue(nextQueue);
  }, []);

  const syncNow = useCallback(async (): Promise<SyncExecutionResult> => {
    setIsSyncing(true);
    try {
      const res = await synchronizePendingQueue(isEffectiveOnline);
      setLastSyncResult(res);
      setLastSyncedAt(res.syncedAt);
      const [nextAttempts, nextQueue] = await Promise.all([
        db.attempts.toArray(),
        db.syncQueue.toArray(),
      ]);
      setAttempts(nextAttempts);
      setSyncQueue(nextQueue);
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, [isEffectiveOnline]);

  const resetDemo = useCallback(async () => {
    await resetDemoDatabase();
    setLastSyncResult(null);
    await loadAllFromDb();
  }, [loadAllFromDb]);

  return {
    loading,
    error,
    students,
    attempts,
    syncQueue,
    pendingSyncItems,
    interventions,
    activeStudentId,
    activeSnapshot,
    studentSnapshots,
    commonLearningGaps,
    language,
    browserOnline,
    simulatedOffline,
    isEffectiveOnline,
    syncState,
    lastSyncedAt,
    lastSyncResult,
    isSyncing,
    supabaseConfigured: isSupabaseConfigured(),
    switchStudent,
    setLanguage,
    toggleSimulatedOffline,
    logAttempt,
    logBatchAttempts,
    markInterventionCompleted,
    syncNow,
    resetDemo,
  };
}
