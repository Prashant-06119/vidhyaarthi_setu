import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRecommendation,
  buildStudentAdaptiveSnapshot,
  calculateConceptMastery,
  computeCommonLearningGaps,
  detectMisconceptions,
} from '../src/engine/adaptiveEngine';
import { filterDeduplicatedPendingItems } from '../src/services/syncService';
import { FRACTION_LESSONS } from '../src/data/lessons/fractionLessons';
import { PRACTICE_EXERCISES } from '../src/data/exercises/practiceExercises';
import { DEMO_STUDENTS, SEED_ATTEMPTS } from '../src/data/demoStudents/seedProfiles';
import { AttemptRecord, SyncQueueItem } from '../src/types/domain';

function makeAttempt(overrides: Partial<AttemptRecord>): AttemptRecord {
  return {
    eventId: `evt-${Math.random().toString(36).slice(2)}`,
    studentId: 'student-a',
    sessionId: 'sess-1',
    questionId: 'dq-5',
    conceptId: 'equivalent_fractions',
    selectedOptionId: 'dq-5-b',
    isCorrect: false,
    misconceptionId: 'add_numerator_denominator_same',
    phase: 'diagnostic',
    timestamp: '2026-11-22T10:00:00.000Z',
    syncStatus: 'PENDING',
    ...overrides,
  };
}

test('single incorrect answer does not confirm a misconception gap', () => {
  const attempts: AttemptRecord[] = [
    makeAttempt({ questionId: 'dq-5', misconceptionId: 'add_numerator_denominator_same' }),
  ];
  const detected = detectMisconceptions(attempts);
  assert.equal(detected.length, 1);
  assert.equal(detected[0].isConfirmedGap, false);
  assert.equal(detected[0].isWatchItem, true);
});

test('repeated mistakes on the same question do not count as multiple distinct questions', () => {
  const attempts: AttemptRecord[] = [
    makeAttempt({ questionId: 'dq-5', timestamp: '2026-11-22T10:00:00.000Z' }),
    makeAttempt({ questionId: 'dq-5', timestamp: '2026-11-22T10:01:00.000Z' }),
  ];
  const detected = detectMisconceptions(attempts);
  assert.equal(detected[0].distinctQuestionIds.length, 1);
  assert.equal(detected[0].isConfirmedGap, false);
});

test('repeated misconception across 2 distinct questions confirms gap and routes to visual remediation', () => {
  const attempts: AttemptRecord[] = [
    makeAttempt({ questionId: 'dq-1', conceptId: 'numerator_denominator', isCorrect: true, misconceptionId: undefined }),
    makeAttempt({ questionId: 'dq-3', conceptId: 'fraction_representation', isCorrect: true, misconceptionId: undefined }),
    makeAttempt({ questionId: 'dq-5', conceptId: 'equivalent_fractions', isCorrect: false, misconceptionId: 'add_numerator_denominator_same' }),
    makeAttempt({ questionId: 'dq-6', conceptId: 'equivalent_fractions', isCorrect: false, misconceptionId: 'add_numerator_denominator_same' }),
    makeAttempt({ questionId: 'dq-8', conceptId: 'comparing_fractions', isCorrect: true, misconceptionId: undefined }),
  ];

  const misconceptions = detectMisconceptions(attempts);
  const equivGap = misconceptions.find((m) => m.misconceptionId === 'add_numerator_denominator_same');
  assert.ok(equivGap);
  assert.equal(equivGap.isConfirmedGap, true);
  assert.equal(equivGap.distinctQuestionIds.length, 2);

  const mastery = calculateConceptMastery(attempts, misconceptions);
  const rec = buildRecommendation({
    studentId: 'student-a',
    attempts,
    masteryStates: mastery,
    misconceptions,
    lessons: FRACTION_LESSONS,
    exercises: PRACTICE_EXERCISES,
  });

  assert.equal(rec.activityType, 'visual_remediation');
  assert.equal(rec.primaryConceptId, 'equivalent_fractions');
  assert.equal(rec.lessonModuleId, 'lesson-equiv-visual');
});

test('Student A (equivalent fractions) and Student B (comparing fractions) receive distinct adaptive paths', () => {
  const studentAAttempts: AttemptRecord[] = [
    makeAttempt({ studentId: 'student-a', questionId: 'dq-1', conceptId: 'numerator_denominator', isCorrect: true, misconceptionId: undefined }),
    makeAttempt({ studentId: 'student-a', questionId: 'dq-3', conceptId: 'fraction_representation', isCorrect: true, misconceptionId: undefined }),
    makeAttempt({ studentId: 'student-a', questionId: 'dq-5', conceptId: 'equivalent_fractions', isCorrect: false, misconceptionId: 'add_numerator_denominator_same' }),
    makeAttempt({ studentId: 'student-a', questionId: 'dq-6', conceptId: 'equivalent_fractions', isCorrect: false, misconceptionId: 'add_numerator_denominator_same' }),
    makeAttempt({ studentId: 'student-a', questionId: 'dq-8', conceptId: 'comparing_fractions', isCorrect: true, misconceptionId: undefined }),
  ];

  const snapA = buildStudentAdaptiveSnapshot({
    student: DEMO_STUDENTS[0],
    attempts: studentAAttempts,
    lessons: FRACTION_LESSONS,
    exercises: PRACTICE_EXERCISES,
  });

  const snapB = buildStudentAdaptiveSnapshot({
    student: DEMO_STUDENTS[1],
    attempts: SEED_ATTEMPTS,
    lessons: FRACTION_LESSONS,
    exercises: PRACTICE_EXERCISES,
  });

  assert.equal(snapA.recommendation.primaryConceptId, 'equivalent_fractions');
  assert.equal(snapA.recommendation.lessonModuleId, 'lesson-equiv-visual');

  assert.equal(snapB.recommendation.primaryConceptId, 'comparing_fractions');
  assert.equal(snapB.recommendation.lessonModuleId, 'lesson-compare-visual');
  assert.notEqual(snapA.recommendation.lessonModuleId, snapB.recommendation.lessonModuleId);
});

test('reassessment after remediation updates concept mastery and resolves misconception', () => {
  const attempts: AttemptRecord[] = [
    makeAttempt({ questionId: 'dq-1', conceptId: 'numerator_denominator', isCorrect: true, misconceptionId: undefined, timestamp: '2026-11-22T09:00:00.000Z' }),
    makeAttempt({ questionId: 'dq-5', conceptId: 'equivalent_fractions', isCorrect: false, misconceptionId: 'add_numerator_denominator_same', timestamp: '2026-11-22T09:01:00.000Z' }),
    makeAttempt({ questionId: 'dq-6', conceptId: 'equivalent_fractions', isCorrect: false, misconceptionId: 'add_numerator_denominator_same', timestamp: '2026-11-22T09:02:00.000Z' }),
    makeAttempt({ questionId: 'dq-8', conceptId: 'comparing_fractions', isCorrect: true, misconceptionId: undefined, timestamp: '2026-11-22T09:03:00.000Z' }),
    // Reassessment after remediation (3/3 correct)
    makeAttempt({ questionId: 'ra-equiv-1', conceptId: 'equivalent_fractions', isCorrect: true, misconceptionId: undefined, phase: 'reassessment', timestamp: '2026-11-22T09:15:00.000Z' }),
    makeAttempt({ questionId: 'ra-equiv-2', conceptId: 'equivalent_fractions', isCorrect: true, misconceptionId: undefined, phase: 'reassessment', timestamp: '2026-11-22T09:16:00.000Z' }),
    makeAttempt({ questionId: 'ra-equiv-3', conceptId: 'equivalent_fractions', isCorrect: true, misconceptionId: undefined, phase: 'reassessment', timestamp: '2026-11-22T09:17:00.000Z' }),
  ];

  const misconceptions = detectMisconceptions(attempts);
  assert.equal(misconceptions[0].resolved, true);

  const mastery = calculateConceptMastery(attempts, misconceptions);
  const equivMastery = mastery.find((m) => m.conceptId === 'equivalent_fractions');
  assert.ok(equivMastery);
  assert.equal(equivMastery.accuracy, 80);
  assert.equal(equivMastery.level, 'strong');
});

test('teacher analytics groups shared and individual learning gaps accurately', () => {
  const attemptsBoth: AttemptRecord[] = [
    ...SEED_ATTEMPTS,
    makeAttempt({ studentId: 'student-a', questionId: 'dq-8', conceptId: 'comparing_fractions', isCorrect: false, misconceptionId: 'larger_denominator_means_larger_fraction' }),
    makeAttempt({ studentId: 'student-a', questionId: 'dq-9', conceptId: 'comparing_fractions', isCorrect: false, misconceptionId: 'larger_denominator_means_larger_fraction' }),
  ];

  const snapA = buildStudentAdaptiveSnapshot({
    student: DEMO_STUDENTS[0],
    attempts: attemptsBoth,
    lessons: FRACTION_LESSONS,
    exercises: PRACTICE_EXERCISES,
  });
  const snapB = buildStudentAdaptiveSnapshot({
    student: DEMO_STUDENTS[1],
    attempts: attemptsBoth,
    lessons: FRACTION_LESSONS,
    exercises: PRACTICE_EXERCISES,
  });

  const gaps = computeCommonLearningGaps([snapA, snapB]);
  const shared = gaps.find((g) => g.misconceptionId === 'larger_denominator_means_larger_fraction');
  assert.ok(shared);
  assert.equal(shared.isSharedAcrossStudents, true);
  assert.equal(shared.affectedStudentIds.length, 2);
});

test('sync deduplication prevents duplicate eventId submissions and skips synced items', () => {
  const queue: SyncQueueItem[] = [
    { eventId: 'e1', studentId: 'student-a', eventType: 'attempt', payload: {}, createdAt: '2026-11-22T10:00:00.000Z', status: 'PENDING' },
    { eventId: 'e1', studentId: 'student-a', eventType: 'attempt', payload: {}, createdAt: '2026-11-22T10:00:01.000Z', status: 'PENDING' },
    { eventId: 'e2', studentId: 'student-a', eventType: 'attempt', payload: {}, createdAt: '2026-11-22T10:01:00.000Z', status: 'SYNCED' },
    { eventId: 'e3', studentId: 'student-b', eventType: 'attempt', payload: {}, createdAt: '2026-11-22T10:02:00.000Z', status: 'PENDING' },
  ];

  const { toSubmit, duplicateCount } = filterDeduplicatedPendingItems(queue);
  assert.equal(toSubmit.length, 2);
  assert.equal(duplicateCount, 1);
  assert.deepEqual(
    toSubmit.map((i) => i.eventId),
    ['e1', 'e3']
  );
});
