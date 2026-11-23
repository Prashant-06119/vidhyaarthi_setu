import {
  AdaptiveRecommendation,
  AttemptRecord,
  ConceptMasteryState,
  FractionConceptId,
  LessonModule,
  MisconceptionEvidence,
  PracticeExercise,
} from '../types/domain';
import { ADAPTIVE_THRESHOLDS, CONCEPT_METADATA, MISCONCEPTION_METADATA } from './thresholds';

/**
 * Deterministic rule-based recommendation engine.
 * Evaluates concept mastery, repeated misconceptions, and diagnostic completeness
 * to choose the next lesson module and practice exercises — and explains WHY.
 */
export function buildRecommendation(params: {
  studentId: string;
  attempts: AttemptRecord[];
  masteryStates: ConceptMasteryState[];
  misconceptions: MisconceptionEvidence[];
  lessons: LessonModule[];
  exercises: PracticeExercise[];
  nowIso?: string;
}): AdaptiveRecommendation {
  const { studentId, attempts, masteryStates, misconceptions, lessons, exercises } = params;
  const nowIso = params.nowIso ?? new Date().toISOString();
  const ruleTrace: string[] = [];

  const diagnosticAttempts = attempts.filter((a) => a.phase === 'diagnostic');
  const activeConfirmedMisconceptions = misconceptions.filter(
    (m) => m.isConfirmedGap && !m.resolved
  );

  // Rule 1: Require baseline diagnostic evidence before prescribing remediation
  if (diagnosticAttempts.length < ADAPTIVE_THRESHOLDS.MIN_DIAGNOSTIC_QUESTIONS) {
    ruleTrace.push(
      `Rule 1 [Diagnostic Check]: Only ${diagnosticAttempts.length}/${ADAPTIVE_THRESHOLDS.MIN_DIAGNOSTIC_QUESTIONS} diagnostic responses recorded -> Recommend completing Diagnostic Assessment.`
    );
    const defaultLesson = lessons[0]?.id ?? 'lesson-equiv-visual';
    return {
      studentId,
      generatedAt: nowIso,
      activityType: 'diagnostic_needed',
      primaryConceptId: 'numerator_denominator',
      targetLevel: 'weak',
      flaggedMisconceptions: activeConfirmedMisconceptions,
      lessonModuleId: defaultLesson,
      exerciseIds: exercises.slice(0, 3).map((e) => e.id),
      reassessmentConceptId: 'numerator_denominator',
      reasonEn:
        'Complete the short Grade 6 Fractions diagnostic assessment so the adaptive engine can evaluate concept mastery and check for repeated error patterns.',
      reasonKn:
        'ನಿಮ್ಮ ಪರಿಕಲ್ಪನಾ ಮಟ್ಟ ಮತ್ತು ತಪ್ಪು ಮಾದರಿಗಳನ್ನು ಗುರುತಿಸಲು ಗ್ರೇಡ್ 6 ಭಿನ್ನರಾಶಿಗಳ ಪ್ರಾಥಮಿಕ ಪರೀಕ್ಷೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
      ruleTrace,
    };
  }

  ruleTrace.push(
    `Rule 1 [Diagnostic Check]: ${diagnosticAttempts.length} diagnostic responses available -> Proceeding to misconception & mastery evaluation.`
  );

  // Rule 2: Confirmed misconception across >= 2 distinct questions takes highest priority
  if (activeConfirmedMisconceptions.length > 0) {
    const primaryGap = activeConfirmedMisconceptions[0];
    const conceptMeta = CONCEPT_METADATA[primaryGap.conceptId];
    const gapMeta = MISCONCEPTION_METADATA[primaryGap.misconceptionId];

    ruleTrace.push(
      `Rule 2 [Misconception Trigger]: Detected "${gapMeta.labelEn}" across ${primaryGap.distinctQuestionIds.length} distinct questions (threshold >= ${ADAPTIVE_THRESHOLDS.MIN_DISTINCT_QUESTIONS_FOR_MISCONCEPTION}) -> Assign visual remediation.`
    );

    const matchedLesson =
      lessons.find((l) => l.targetMisconceptions.includes(primaryGap.misconceptionId)) ??
      lessons.find((l) => l.conceptId === primaryGap.conceptId) ??
      lessons[0];

    const targetedExercises = exercises
      .filter(
        (ex) =>
          ex.conceptId === primaryGap.conceptId &&
          (ex.level === 'foundational' ||
            ex.level === 'guided' ||
            ex.targetMisconceptions?.includes(primaryGap.misconceptionId))
      )
      .slice(0, 3);

    return {
      studentId,
      generatedAt: nowIso,
      activityType: 'visual_remediation',
      primaryConceptId: primaryGap.conceptId,
      targetLevel: 'weak',
      flaggedMisconceptions: activeConfirmedMisconceptions,
      lessonModuleId: matchedLesson.id,
      exerciseIds: targetedExercises.map((e) => e.id),
      reassessmentConceptId: primaryGap.conceptId,
      reasonEn: `Possible learning gap identified in ${conceptMeta.titleEn}: "${gapMeta.labelEn}" appeared across ${primaryGap.distinctQuestionIds.length} separate questions. Selected visual step-by-step explanation and targeted foundational practice.`,
      reasonKn: `${conceptMeta.titleKn} ವಿಷಯದಲ್ಲಿ ಕಲಿಕಾ ಅಂತರ ಕಂಡುಬಂದಿದೆ: "${gapMeta.labelKn}" ಮಾದರಿಯು ${primaryGap.distinctQuestionIds.length} ಪ್ರತ್ಯೇಕ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಪುನರಾವರ್ತನೆಯಾಗಿದೆ. ದೃಶ್ಯ ವಿವರಣೆ ಮತ್ತು ಗುರಿ ಅಭ್ಯಾಸವನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.`,
      ruleTrace,
    };
  }

  ruleTrace.push(
    `Rule 2 [Misconception Trigger]: 0 unresolved misconceptions across >= ${ADAPTIVE_THRESHOLDS.MIN_DISTINCT_QUESTIONS_FOR_MISCONCEPTION} distinct questions.`
  );

  // Rule 3: Lowest mastery concept < 50% -> Weak -> Simpler Visual Explanation
  const sortedByWeakness = [...masteryStates]
    .filter((m) => m.hasEvidence)
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakest = sortedByWeakness[0];
  if (weakest && weakest.level === 'weak') {
    const conceptMeta = CONCEPT_METADATA[weakest.conceptId];
    ruleTrace.push(
      `Rule 3 [Weak Mastery]: ${conceptMeta.titleEn} accuracy is ${weakest.accuracy}% (< ${ADAPTIVE_THRESHOLDS.WEAK_ACCURACY_UPPER_BOUND}%) -> Assign simpler visual explanation & foundational practice.`
    );

    const matchedLesson =
      lessons.find((l) => l.conceptId === weakest.conceptId) ?? lessons[0];
    const foundationalExercises = exercises
      .filter((ex) => ex.conceptId === weakest.conceptId && ex.level === 'foundational')
      .slice(0, 3);

    return {
      studentId,
      generatedAt: nowIso,
      activityType: 'visual_remediation',
      primaryConceptId: weakest.conceptId,
      targetLevel: 'weak',
      flaggedMisconceptions: [],
      lessonModuleId: matchedLesson.id,
      exerciseIds: foundationalExercises.map((e) => e.id),
      reassessmentConceptId: weakest.conceptId,
      reasonEn: `Understanding in ${conceptMeta.titleEn} is currently foundational (${weakest.accuracy}%). Assigned a visual step-by-step explanation followed by foundational exercises and reassessment.`,
      reasonKn: `${conceptMeta.titleKn} ವಿಷಯದಲ್ಲಿ ಅಂಕ ${weakest.accuracy}% ಇರುವುದರಿಂದ ಸರಳ ದೃಶ್ಯ ವಿವರಣೆ ಮತ್ತು ಮೂಲಭೂತ ಅಭ್ಯಾಸವನ್ನು ನೀಡಲಾಗಿದೆ.`,
      ruleTrace,
    };
  }

  // Rule 4: Developing concept (50%-79%) -> Guided Practice
  const developing = sortedByWeakness.find((m) => m.level === 'developing');
  if (developing) {
    const conceptMeta = CONCEPT_METADATA[developing.conceptId];
    ruleTrace.push(
      `Rule 4 [Developing Mastery]: ${conceptMeta.titleEn} accuracy is ${developing.accuracy}% (${ADAPTIVE_THRESHOLDS.WEAK_ACCURACY_UPPER_BOUND}%–${ADAPTIVE_THRESHOLDS.DEVELOPING_ACCURACY_UPPER_BOUND - 1}%) -> Assign guided exercises.`
    );

    const matchedLesson =
      lessons.find((l) => l.conceptId === developing.conceptId) ?? lessons[0];
    const guidedExercises = exercises
      .filter((ex) => ex.conceptId === developing.conceptId && ex.level === 'guided')
      .slice(0, 3);

    return {
      studentId,
      generatedAt: nowIso,
      activityType: 'guided_practice',
      primaryConceptId: developing.conceptId,
      targetLevel: 'developing',
      flaggedMisconceptions: [],
      lessonModuleId: matchedLesson.id,
      exerciseIds:
        guidedExercises.length > 0
          ? guidedExercises.map((e) => e.id)
          : exercises.filter((e) => e.conceptId === developing.conceptId).slice(0, 3).map((e) => e.id),
      reassessmentConceptId: developing.conceptId,
      reasonEn: `Understanding in ${conceptMeta.titleEn} is developing (${developing.accuracy}%). Assigned guided visual exercises with hints to consolidate mastery above 80%.`,
      reasonKn: `${conceptMeta.titleKn} ವಿಷಯದಲ್ಲಿ ಪ್ರಗತಿ ಹಂತ (${developing.accuracy}%) ಇದೆ. 80% ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಪ್ರಾವೀಣ್ಯತೆಗಾಗಿ ಮಾರ್ಗದರ್ಶಿತ ಅಭ್ಯಾಸಗಳನ್ನು ನೀಡಲಾಗಿದೆ.`,
      ruleTrace,
    };
  }

  // Rule 5: All concepts strong (>= 80%) -> Challenge Enrichment
  const strongestConcept: FractionConceptId =
    sortedByWeakness[sortedByWeakness.length - 1]?.conceptId ?? 'comparing_fractions';
  const conceptMeta = CONCEPT_METADATA[strongestConcept];
  ruleTrace.push(
    `Rule 5 [Strong Mastery]: All assessed concepts >= ${ADAPTIVE_THRESHOLDS.DEVELOPING_ACCURACY_UPPER_BOUND}% -> Unlock challenging multi-step fraction problems.`
  );

  const matchedLesson =
    lessons.find((l) => l.conceptId === strongestConcept) ?? lessons[0];
  const challengeExercises = exercises
    .filter((ex) => ex.level === 'challenge')
    .slice(0, 3);

  return {
    studentId,
    generatedAt: nowIso,
    activityType: 'challenge_practice',
    primaryConceptId: strongestConcept,
    targetLevel: 'strong',
    flaggedMisconceptions: [],
    lessonModuleId: matchedLesson.id,
    exerciseIds: challengeExercises.map((e) => e.id),
    reassessmentConceptId: strongestConcept,
    reasonEn: `All assessed fraction concepts are strong (>= 80%). Unlocked challenging multi-step reasoning tasks starting with ${conceptMeta.titleEn}.`,
    reasonKn: `ಎಲ್ಲಾ ಭಿನ್ನರಾಶಿ ಪರಿಕಲ್ಪನೆಗಳಲ್ಲಿ ಉತ್ತಮ ಪ್ರಾವೀಣ್ಯತೆ (>= 80%) ಸಾಧಿಸಲಾಗಿದೆ. ಸವಾಲಿನ ತಾರ್ಕಿಕ ಅಭ್ಯಾಸಗಳನ್ನು ನೀಡಲಾಗಿದೆ.`,
    ruleTrace,
  };
}
