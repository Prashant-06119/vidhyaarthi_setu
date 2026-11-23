import {
  AttemptRecord,
  CommonLearningGap,
  FractionConceptId,
  MisconceptionId,
  StudentAdaptiveSnapshot,
  StudentProfile,
} from '../types/domain';
import { calculateConceptMastery, calculateOverallAccuracy } from './masteryCalculator';
import { detectMisconceptions } from './misconceptionDetector';
import { buildRecommendation } from './recommendationEngine';
import { CONCEPT_METADATA, MISCONCEPTION_METADATA } from './thresholds';
import { LessonModule, PracticeExercise } from '../types/domain';

export function buildStudentAdaptiveSnapshot(params: {
  student: StudentProfile;
  attempts: AttemptRecord[];
  lessons: LessonModule[];
  exercises: PracticeExercise[];
}): StudentAdaptiveSnapshot {
  const studentAttempts = params.attempts.filter((a) => a.studentId === params.student.id);
  const misconceptions = detectMisconceptions(studentAttempts);
  const masteryByConcept = calculateConceptMastery(studentAttempts, misconceptions);
  const overallAccuracy = calculateOverallAccuracy(masteryByConcept);
  const diagnosticCompletedCount = studentAttempts.filter(
    (a) => a.phase === 'diagnostic'
  ).length;

  const hasWeakConcept = masteryByConcept.some((m) => m.hasEvidence && m.level === 'weak');
  const hasActiveMisconception = misconceptions.some(
    (m) => m.isConfirmedGap && !m.resolved
  );
  const needsSupport = hasWeakConcept || hasActiveMisconception;

  const recommendation = buildRecommendation({
    studentId: params.student.id,
    attempts: studentAttempts,
    masteryStates: masteryByConcept,
    misconceptions,
    lessons: params.lessons,
    exercises: params.exercises,
  });

  return {
    student: params.student,
    attempts: studentAttempts,
    masteryByConcept,
    overallAccuracy,
    diagnosticCompletedCount,
    needsSupport,
    misconceptions,
    recommendation,
  };
}

/**
 * Aggregates Common Learning Gaps across all student snapshots for the Teacher Intelligence Dashboard.
 * Groups repeated misconceptions and weak concepts, prioritizing shared gaps across multiple students
 * as well as individual urgent learning gaps requiring teacher intervention.
 */
export function computeCommonLearningGaps(
  snapshots: StudentAdaptiveSnapshot[]
): CommonLearningGap[] {
  const gapBuckets = new Map<
    string,
    {
      conceptId: FractionConceptId;
      misconceptionId?: MisconceptionId;
      studentIds: Set<string>;
      studentNames: Set<string>;
    }
  >();

  for (const snap of snapshots) {
    // Active confirmed misconceptions
    for (const m of snap.misconceptions) {
      if (m.isConfirmedGap && !m.resolved) {
        const key = `misconception:${m.misconceptionId}`;
        const existing = gapBuckets.get(key) ?? {
          conceptId: m.conceptId,
          misconceptionId: m.misconceptionId,
          studentIds: new Set<string>(),
          studentNames: new Set<string>(),
        };
        existing.studentIds.add(snap.student.id);
        existing.studentNames.add(snap.student.name);
        gapBuckets.set(key, existing);
      }
    }

    // Weak or developing concepts without an already-captured confirmed misconception on that concept
    for (const mastery of snap.masteryByConcept) {
      if (mastery.hasEvidence && mastery.level === 'weak') {
        const alreadyCovered = snap.misconceptions.some(
          (m) => m.conceptId === mastery.conceptId && m.isConfirmedGap && !m.resolved
        );
        if (!alreadyCovered) {
          const key = `concept:${mastery.conceptId}`;
          const existing = gapBuckets.get(key) ?? {
            conceptId: mastery.conceptId,
            studentIds: new Set<string>(),
            studentNames: new Set<string>(),
          };
          existing.studentIds.add(snap.student.id);
          existing.studentNames.add(snap.student.name);
          gapBuckets.set(key, existing);
        }
      }
    }
  }

  const gaps: CommonLearningGap[] = [];
  for (const [gapKey, bucket] of gapBuckets.entries()) {
    const affectedIds = Array.from(bucket.studentIds);
    const affectedNames = Array.from(bucket.studentNames);
    const conceptMeta = CONCEPT_METADATA[bucket.conceptId];
    const misconceptionMeta = bucket.misconceptionId
      ? MISCONCEPTION_METADATA[bucket.misconceptionId]
      : null;

    gaps.push({
      gapKey,
      conceptId: bucket.conceptId,
      misconceptionId: bucket.misconceptionId,
      affectedStudentIds: affectedIds,
      affectedStudentNames: affectedNames,
      isSharedAcrossStudents: affectedIds.length >= 2,
      severityScore: affectedIds.length * 10 + (misconceptionMeta ? 5 : 0),
      summaryEn: misconceptionMeta
        ? `${conceptMeta.titleEn}: ${misconceptionMeta.labelEn}`
        : `${conceptMeta.titleEn}: Foundational accuracy below 50%`,
      summaryKn: misconceptionMeta
        ? `${conceptMeta.titleKn}: ${misconceptionMeta.labelKn}`
        : `${conceptMeta.titleKn}: ಮೂಲಭೂತ ಪ್ರಾವೀಣ್ಯತೆ 50% ಕ್ಕಿಂತ ಕಡಿಮೆ ಇದೆ`,
      recommendedGroupActivityEn: misconceptionMeta
        ? misconceptionMeta.remediationHintEn
        : `Conduct a 15-minute hands-on paper-folding and fraction-bar revision session on ${conceptMeta.titleEn}.`,
      recommendedGroupActivityKn: misconceptionMeta
        ? misconceptionMeta.remediationHintKn
        : `${conceptMeta.titleKn} ಕುರಿತು 15 ನಿಮಿಷಗಳ ಕಾಗದ ಮಡಿಸುವ ಮತ್ತು ಭಿನ್ನರಾಶಿ ಪಟ್ಟಿ ಚಟುವಟಿಕೆ ನಡೆಸಿ.`,
    });
  }

  return gaps.sort((a, b) => b.severityScore - a.severityScore);
}
