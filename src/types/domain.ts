export type Language = 'en' | 'kn';

export type FractionConceptId =
  | 'numerator_denominator'
  | 'fraction_representation'
  | 'equivalent_fractions'
  | 'comparing_fractions';

export type MisconceptionId =
  | 'add_numerator_denominator_same'
  | 'multiply_only_numerator_or_denom'
  | 'larger_denominator_means_larger_fraction'
  | 'compare_only_numerators'
  | 'swap_part_and_whole'
  | 'count_unshaded_as_numerator';

export type MasteryLevel = 'weak' | 'developing' | 'strong';

export type AttemptPhase = 'diagnostic' | 'practice' | 'reassessment';

export type SyncRecordStatus = 'PENDING' | 'SYNCED';

export type ConnectivitySyncState = 'OFFLINE' | 'PENDING_SYNC' | 'SYNCED';

export type AppView =
  | 'welcome'
  | 'student-hub'
  | 'diagnostic'
  | 'learning-lab'
  | 'teacher-dashboard';

export interface BilingualText {
  en: string;
  kn: string;
}

export interface FractionSpec {
  numerator: number;
  denominator: number;
  label?: string;
}

export interface VisualSpec {
  type: 'none' | 'bar' | 'circle' | 'pair_bars' | 'number_line';
  primary?: FractionSpec;
  secondary?: FractionSpec;
}

export interface StudentProfile {
  id: string;
  name: string;
  nameKn: string;
  grade: number;
  schoolLabel: string;
  schoolLabelKn: string;
  avatarInitials: string;
  accentColor: string;
  demoFocusEn: string;
  demoFocusKn: string;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  labelEn: string;
  labelKn: string;
  isCorrect: boolean;
  misconceptionId?: MisconceptionId;
}

export interface DiagnosticQuestion {
  id: string;
  conceptId: FractionConceptId;
  difficulty: 'foundational' | 'standard' | 'stretch';
  promptEn: string;
  promptKn: string;
  visualSpec: VisualSpec;
  options: QuestionOption[];
  explanationEn: string;
  explanationKn: string;
}

export interface PracticeExercise {
  id: string;
  conceptId: FractionConceptId;
  level: 'foundational' | 'guided' | 'challenge';
  targetMisconceptions?: MisconceptionId[];
  promptEn: string;
  promptKn: string;
  hintEn: string;
  hintKn: string;
  visualSpec: VisualSpec;
  options: QuestionOption[];
  explanationEn: string;
  explanationKn: string;
}

export interface LessonStep {
  id: string;
  titleEn: string;
  titleKn: string;
  explanationEn: string;
  explanationKn: string;
  visualType: 'bar' | 'circle' | 'equivalent_split' | 'comparison_strip';
  fractionA: FractionSpec;
  fractionB?: FractionSpec;
  multiplier?: number;
}

export interface LessonModule {
  id: string;
  conceptId: FractionConceptId;
  targetLevel: MasteryLevel;
  targetMisconceptions: MisconceptionId[];
  titleEn: string;
  titleKn: string;
  summaryEn: string;
  summaryKn: string;
  interactiveSandbox: 'equivalent_explorer' | 'comparison_lab' | 'part_whole_builder';
  steps: LessonStep[];
}

export interface AttemptRecord {
  eventId: string;
  studentId: string;
  sessionId: string;
  questionId: string;
  conceptId: FractionConceptId;
  selectedOptionId: string;
  isCorrect: boolean;
  misconceptionId?: MisconceptionId;
  phase: AttemptPhase;
  timestamp: string;
  syncStatus: SyncRecordStatus;
}

export interface SyncQueueItem {
  eventId: string;
  studentId: string;
  eventType: 'attempt' | 'lesson_completed' | 'intervention_updated';
  payload: Record<string, unknown>;
  createdAt: string;
  status: SyncRecordStatus;
  syncedAt?: string;
  syncAdapter?: 'demo-local-adapter' | 'supabase-postgres';
}

export interface MisconceptionEvidence {
  misconceptionId: MisconceptionId;
  conceptId: FractionConceptId;
  distinctQuestionIds: string[];
  totalOccurrences: number;
  lastOccurredAt: string;
  isConfirmedGap: boolean;
  isWatchItem: boolean;
  resolved: boolean;
}

export interface ConceptMasteryState {
  conceptId: FractionConceptId;
  totalAttempts: number;
  correctAttempts: number;
  diagnosticAttempts: number;
  diagnosticAccuracy: number | null;
  reassessmentAttempts: number;
  reassessmentAccuracy: number | null;
  accuracy: number;
  hasEvidence: boolean;
  level: MasteryLevel;
  flaggedMisconceptions: MisconceptionEvidence[];
  lastUpdatedAt: string | null;
}

export type ActivityType =
  | 'diagnostic_needed'
  | 'visual_remediation'
  | 'guided_practice'
  | 'challenge_practice';

export interface AdaptiveRecommendation {
  studentId: string;
  generatedAt: string;
  activityType: ActivityType;
  primaryConceptId: FractionConceptId;
  targetLevel: MasteryLevel;
  flaggedMisconceptions: MisconceptionEvidence[];
  lessonModuleId: string;
  exerciseIds: string[];
  reassessmentConceptId: FractionConceptId;
  reasonEn: string;
  reasonKn: string;
  ruleTrace: string[];
}

export interface TeacherIntervention {
  id: string;
  gapKey: string;
  conceptId: FractionConceptId;
  misconceptionId?: MisconceptionId;
  titleEn: string;
  titleKn: string;
  affectedStudentIds: string[];
  recommendedActivityEn: string;
  recommendedActivityKn: string;
  status: 'open' | 'completed';
  completedAt?: string;
}

export interface CommonLearningGap {
  gapKey: string;
  conceptId: FractionConceptId;
  misconceptionId?: MisconceptionId;
  affectedStudentIds: string[];
  affectedStudentNames: string[];
  isSharedAcrossStudents: boolean;
  severityScore: number;
  summaryEn: string;
  summaryKn: string;
  recommendedGroupActivityEn: string;
  recommendedGroupActivityKn: string;
}

export interface StudentAdaptiveSnapshot {
  student: StudentProfile;
  attempts: AttemptRecord[];
  masteryByConcept: ConceptMasteryState[];
  overallAccuracy: number;
  diagnosticCompletedCount: number;
  needsSupport: boolean;
  misconceptions: MisconceptionEvidence[];
  recommendation: AdaptiveRecommendation;
}
