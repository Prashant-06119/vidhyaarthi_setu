import {
  AttemptRecord,
  ConceptMasteryState,
  FractionConceptId,
  MasteryLevel,
  MisconceptionEvidence,
} from '../types/domain';
import { ADAPTIVE_THRESHOLDS, CONCEPT_METADATA } from './thresholds';

const ALL_CONCEPTS: FractionConceptId[] = [
  'numerator_denominator',
  'fraction_representation',
  'equivalent_fractions',
  'comparing_fractions',
];

export function classifyMasteryLevel(accuracy: number): MasteryLevel {
  if (accuracy < ADAPTIVE_THRESHOLDS.WEAK_ACCURACY_UPPER_BOUND) {
    return 'weak';
  }
  if (accuracy < ADAPTIVE_THRESHOLDS.DEVELOPING_ACCURACY_UPPER_BOUND) {
    return 'developing';
  }
  return 'strong';
}

/**
 * Calculates deterministic concept-wise mastery from student attempts.
 *
 * Rules:
 * - Diagnostic & practice attempts establish the baseline accuracy.
 * - When reassessment attempts exist (>= 2), reassessment evidence carries 80% weight
 *   (REASSESSMENT_WEIGHT) so successful remediation measurably upgrades mastery.
 * - Active (unresolved) confirmed misconceptions cap mastery at 'developing' if accuracy
 *   happens to border 80%, ensuring targeted remediation is never skipped prematurely.
 */
export function calculateConceptMastery(
  attempts: AttemptRecord[],
  misconceptions: MisconceptionEvidence[]
): ConceptMasteryState[] {
  return ALL_CONCEPTS.sort(
    (a, b) => CONCEPT_METADATA[a].order - CONCEPT_METADATA[b].order
  ).map((conceptId) => {
    const conceptAttempts = attempts.filter((a) => a.conceptId === conceptId);
    const diagnosticList = conceptAttempts.filter((a) => a.phase === 'diagnostic');
    const practiceList = conceptAttempts.filter((a) => a.phase === 'practice');
    const reassessmentList = conceptAttempts.filter((a) => a.phase === 'reassessment');

    const totalAttempts = conceptAttempts.length;
    const correctAttempts = conceptAttempts.filter((a) => a.isCorrect).length;

    const diagnosticAccuracy =
      diagnosticList.length > 0
        ? Math.round(
            (diagnosticList.filter((a) => a.isCorrect).length / diagnosticList.length) * 100
          )
        : null;

    const reassessmentAccuracy =
      reassessmentList.length > 0
        ? Math.round(
            (reassessmentList.filter((a) => a.isCorrect).length / reassessmentList.length) * 100
          )
        : null;

    const baselinePool = [...diagnosticList, ...practiceList];
    const baselineAccuracy =
      baselinePool.length > 0
        ? Math.round(
            (baselinePool.filter((a) => a.isCorrect).length / baselinePool.length) * 100
          )
        : null;

    let effectiveAccuracy = 0;
    if (reassessmentAccuracy !== null && reassessmentList.length >= 2) {
      const prior = baselineAccuracy ?? reassessmentAccuracy;
      effectiveAccuracy = Math.round(
        prior * (1 - ADAPTIVE_THRESHOLDS.REASSESSMENT_WEIGHT) +
          reassessmentAccuracy * ADAPTIVE_THRESHOLDS.REASSESSMENT_WEIGHT
      );
    } else if (baselineAccuracy !== null) {
      effectiveAccuracy = baselineAccuracy;
    } else if (reassessmentAccuracy !== null) {
      effectiveAccuracy = reassessmentAccuracy;
    }

    const conceptMisconceptions = misconceptions.filter(
      (m) => m.conceptId === conceptId && m.isConfirmedGap
    );
    const hasUnresolvedConfirmedGap = conceptMisconceptions.some((m) => !m.resolved);

    let level: MasteryLevel =
      totalAttempts === 0 ? 'weak' : classifyMasteryLevel(effectiveAccuracy);

    if (hasUnresolvedConfirmedGap && level === 'strong') {
      level = 'developing';
    }

    const lastUpdatedAt =
      conceptAttempts.length > 0
        ? conceptAttempts.reduce(
            (latest, cur) => (cur.timestamp > latest ? cur.timestamp : latest),
            conceptAttempts[0].timestamp
          )
        : null;

    return {
      conceptId,
      totalAttempts,
      correctAttempts,
      diagnosticAttempts: diagnosticList.length,
      diagnosticAccuracy,
      reassessmentAttempts: reassessmentList.length,
      reassessmentAccuracy,
      accuracy: effectiveAccuracy,
      hasEvidence: totalAttempts > 0,
      level,
      flaggedMisconceptions: conceptMisconceptions,
      lastUpdatedAt,
    };
  });
}

export function calculateOverallAccuracy(masteryStates: ConceptMasteryState[]): number {
  const withEvidence = masteryStates.filter((m) => m.hasEvidence);
  if (withEvidence.length === 0) return 0;
  const sum = withEvidence.reduce((acc, m) => acc + m.accuracy, 0);
  return Math.round(sum / withEvidence.length);
}
