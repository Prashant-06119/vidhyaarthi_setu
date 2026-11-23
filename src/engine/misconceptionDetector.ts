import {
  AttemptRecord,
  FractionConceptId,
  MisconceptionEvidence,
  MisconceptionId,
} from '../types/domain';
import { ADAPTIVE_THRESHOLDS, MISCONCEPTION_METADATA } from './thresholds';

/**
 * Detects repeated misconception patterns across distinct questions.
 *
 * Core Rule:
 * - A single wrong answer NEVER produces a confirmed learning gap diagnosis.
 * - A misconception is flagged as `isConfirmedGap = true` only when the student
 *   selects options mapped to that misconception across >= 2 DISTINCT questions.
 * - If the student later passes reassessment on the corresponding concept
 *   (>= MIN_REASSESSMENT_QUESTIONS_TO_RESOLVE attempts with >= REASSESSMENT_PASS_ACCURACY),
 *   the misconception is marked `resolved = true`.
 */
export function detectMisconceptions(attempts: AttemptRecord[]): MisconceptionEvidence[] {
  const byMisconception = new Map<
    MisconceptionId,
    {
      conceptId: FractionConceptId;
      distinctQuestions: Set<string>;
      totalOccurrences: number;
      lastOccurredAt: string;
    }
  >();

  // Sort chronologically so timestamps are accurate
  const sorted = [...attempts].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  for (const attempt of sorted) {
    if (attempt.isCorrect || !attempt.misconceptionId) {
      continue;
    }
    const mId = attempt.misconceptionId;
    const conceptId = MISCONCEPTION_METADATA[mId]?.conceptId ?? attempt.conceptId;
    const existing = byMisconception.get(mId);

    if (!existing) {
      byMisconception.set(mId, {
        conceptId,
        distinctQuestions: new Set([attempt.questionId]),
        totalOccurrences: 1,
        lastOccurredAt: attempt.timestamp,
      });
    } else {
      existing.distinctQuestions.add(attempt.questionId);
      existing.totalOccurrences += 1;
      if (attempt.timestamp > existing.lastOccurredAt) {
        existing.lastOccurredAt = attempt.timestamp;
      }
    }
  }

  // Evaluate reassessment resolution per concept
  const reassessmentByConcept = new Map<FractionConceptId, AttemptRecord[]>();
  for (const attempt of sorted) {
    if (attempt.phase === 'reassessment') {
      const list = reassessmentByConcept.get(attempt.conceptId) ?? [];
      list.push(attempt);
      reassessmentByConcept.set(attempt.conceptId, list);
    }
  }

  const results: MisconceptionEvidence[] = [];

  for (const [misconceptionId, info] of byMisconception.entries()) {
    const distinctCount = info.distinctQuestions.size;
    const isConfirmedGap =
      distinctCount >= ADAPTIVE_THRESHOLDS.MIN_DISTINCT_QUESTIONS_FOR_MISCONCEPTION;
    const isWatchItem = distinctCount === 1;

    // Check if reassessment after the last error resolved this concept's misconception
    const conceptReassessments = (reassessmentByConcept.get(info.conceptId) ?? []).filter(
      (r) => r.timestamp >= info.lastOccurredAt
    );

    let resolved = false;
    if (
      conceptReassessments.length >= ADAPTIVE_THRESHOLDS.MIN_REASSESSMENT_QUESTIONS_TO_RESOLVE
    ) {
      const correctCount = conceptReassessments.filter((r) => r.isCorrect).length;
      const accuracy = Math.round((correctCount / conceptReassessments.length) * 100);
      if (accuracy >= ADAPTIVE_THRESHOLDS.REASSESSMENT_PASS_ACCURACY) {
        resolved = true;
      }
    }

    results.push({
      misconceptionId,
      conceptId: info.conceptId,
      distinctQuestionIds: Array.from(info.distinctQuestions),
      totalOccurrences: info.totalOccurrences,
      lastOccurredAt: info.lastOccurredAt,
      isConfirmedGap,
      isWatchItem,
      resolved,
    });
  }

  // Sort confirmed unresolved gaps first, then by distinct question count descending
  return results.sort((a, b) => {
    const aActive = a.isConfirmedGap && !a.resolved ? 1 : 0;
    const bActive = b.isConfirmedGap && !b.resolved ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return b.distinctQuestionIds.length - a.distinctQuestionIds.length;
  });
}
