import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { EquivalentFractionExplorer } from '../components/visuals/EquivalentFractionExplorer';
import { FractionBarVisual } from '../components/visuals/FractionBarVisual';
import { FractionCircleVisual } from '../components/visuals/FractionCircleVisual';
import { FractionComparisonLab } from '../components/visuals/FractionComparisonLab';
import { PartWholeBuilder } from '../components/visuals/PartWholeBuilder';
import { QuestionVisual } from '../components/visuals/QuestionVisual';
import { PRACTICE_EXERCISES, REASSESSMENT_BANK } from '../data/exercises/practiceExercises';
import { t } from '../data/i18n';
import { FRACTION_LESSONS } from '../data/lessons/fractionLessons';
import { CONCEPT_METADATA } from '../engine/thresholds';
import {
  AppView,
  AttemptPhase,
  FractionConceptId,
  Language,
  MisconceptionId,
  PracticeExercise,
  QuestionOption,
  StudentAdaptiveSnapshot,
} from '../types/domain';

interface LearningLabPageProps {
  language: Language;
  snapshot: StudentAdaptiveSnapshot;
  onLogAttempt: (input: {
    studentId: string;
    sessionId: string;
    questionId: string;
    conceptId: FractionConceptId;
    selectedOptionId: string;
    isCorrect: boolean;
    misconceptionId?: MisconceptionId;
    phase: AttemptPhase;
  }) => Promise<unknown>;
  onNavigate: (view: AppView) => void;
}

type LabTab = 'lesson' | 'practice' | 'reassessment';

export const LearningLabPage: React.FC<LearningLabPageProps> = ({
  language,
  snapshot,
  onLogAttempt,
  onNavigate,
}) => {
  const { recommendation, student } = snapshot;

  const [sessionPlan, setSessionPlan] = useState(recommendation);

  useEffect(() => {
    setSessionPlan(recommendation);
    setActiveTab('lesson');
    setStepIdx(0);
    setExIdx(0);
    setSelectedOptId(null);
    setSubmittedOpt(null);
    setShowHint(false);
    setReIdx(0);
    setReSelectedOptId(null);
    setReSubmittedOpt(null);
    setReCompletedCount(0);
    setReCorrectCount(0);
    // Intentionally reset only when switching student profile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id]);

  const activeLesson = useMemo(
    () =>
      FRACTION_LESSONS.find((l) => l.id === sessionPlan.lessonModuleId) ??
      FRACTION_LESSONS[0],
    [sessionPlan.lessonModuleId]
  );

  const targetedExercises = useMemo(() => {
    const matched = PRACTICE_EXERCISES.filter((ex) =>
      sessionPlan.exerciseIds.includes(ex.id)
    );
    return matched.length > 0 ? matched : PRACTICE_EXERCISES.slice(0, 3);
  }, [sessionPlan.exerciseIds]);

  const reassessmentQuestions: PracticeExercise[] = useMemo(() => {
    return (
      REASSESSMENT_BANK[sessionPlan.reassessmentConceptId] ??
      REASSESSMENT_BANK.equivalent_fractions
    );
  }, [sessionPlan.reassessmentConceptId]);

  const [activeTab, setActiveTab] = useState<LabTab>('lesson');
  const [stepIdx, setStepIdx] = useState(0);

  // Practice state
  const [exIdx, setExIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [submittedOpt, setSubmittedOpt] = useState<QuestionOption | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Reassessment state
  const [reIdx, setReIdx] = useState(0);
  const [reSelectedOptId, setReSelectedOptId] = useState<string | null>(null);
  const [reSubmittedOpt, setReSubmittedOpt] = useState<QuestionOption | null>(null);
  const [reCompletedCount, setReCompletedCount] = useState(0);
  const [reCorrectCount, setReCorrectCount] = useState(0);

  const currentStep = activeLesson.steps[stepIdx] ?? activeLesson.steps[0];
  const currentExercise = targetedExercises[exIdx] ?? targetedExercises[0];
  const currentReQuestion = reassessmentQuestions[reIdx] ?? reassessmentQuestions[0];

  const handleSubmitExercise = async () => {
    if (!selectedOptId || submittedOpt || !currentExercise) return;
    const opt = currentExercise.options.find((o) => o.id === selectedOptId);
    if (!opt) return;

    await onLogAttempt({
      studentId: student.id,
      sessionId: `prac-${student.id}-${Date.now()}`,
      questionId: currentExercise.id,
      conceptId: currentExercise.conceptId,
      selectedOptionId: opt.id,
      isCorrect: opt.isCorrect,
      misconceptionId: opt.misconceptionId,
      phase: 'practice',
    });

    setSubmittedOpt(opt);
  };

  const handleNextExercise = () => {
    if (exIdx + 1 < targetedExercises.length) {
      setExIdx((prev) => prev + 1);
      setSelectedOptId(null);
      setSubmittedOpt(null);
      setShowHint(false);
    } else {
      setActiveTab('reassessment');
    }
  };

  const handleSubmitReassessment = async () => {
    if (!reSelectedOptId || reSubmittedOpt || !currentReQuestion) return;
    const opt = currentReQuestion.options.find((o) => o.id === reSelectedOptId);
    if (!opt) return;

    await onLogAttempt({
      studentId: student.id,
      sessionId: `reassess-${student.id}-${Date.now()}`,
      questionId: currentReQuestion.id,
      conceptId: currentReQuestion.conceptId,
      selectedOptionId: opt.id,
      isCorrect: opt.isCorrect,
      misconceptionId: opt.misconceptionId,
      phase: 'reassessment',
    });

    setReSubmittedOpt(opt);
    setReCompletedCount((c) => c + 1);
    if (opt.isCorrect) {
      setReCorrectCount((c) => c + 1);
    }
  };

  const handleNextReassessment = () => {
    if (reIdx + 1 < reassessmentQuestions.length) {
      setReIdx((prev) => prev + 1);
      setReSelectedOptId(null);
      setReSubmittedOpt(null);
    }
  };

  const conceptMeta = CONCEPT_METADATA[sessionPlan.primaryConceptId];
  const updatedConceptMastery = snapshot.masteryByConcept.find(
    (m) => m.conceptId === sessionPlan.reassessmentConceptId
  );

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      {/* Adaptive Path Context Header */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-blue-600">
              {language === 'kn' ? student.nameKn : student.name} ·{' '}
              {language === 'kn' ? conceptMeta.titleKn : conceptMeta.titleEn} ·{' '}
              {sessionPlan.activityType.replace('_', ' ')}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
              {language === 'kn' ? activeLesson.titleKn : activeLesson.titleEn}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {language === 'kn' ? sessionPlan.reasonKn : sessionPlan.reasonEn}
            </p>
          </div>

          {/* 3-Stage Segmented Control */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('lesson')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'lesson'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>1. {language === 'kn' ? 'ದೃಶ್ಯ ಪಾಠ' : 'Visual Lesson'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'practice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              <span>2. {language === 'kn' ? 'ಗುರಿ ಅಭ್ಯಾಸ' : 'Targeted Practice'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reassessment')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'reassessment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>3. {language === 'kn' ? 'ಮರುಮೌಲ್ಯಮಾಪನ' : 'Reassessment'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* STAGE 1: VISUAL LESSON + INTERACTIVE SANDBOX */}
      {activeTab === 'lesson' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Step-by-step visual guide */}
          <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  Step {stepIdx + 1} of {activeLesson.steps.length}
                </span>
                <div className="flex items-center gap-1">
                  {activeLesson.steps.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStepIdx(idx)}
                      aria-label={`Lesson step ${idx + 1}`}
                      className={`h-2 w-6 rounded-full transition-colors ${
                        idx === stepIdx ? 'bg-blue-600' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {language === 'kn' ? currentStep.titleKn : currentStep.titleEn}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {language === 'kn' ? currentStep.explanationKn : currentStep.explanationEn}
              </p>

              <div className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                {currentStep.visualType === 'circle' ? (
                  <div className="flex justify-center">
                    <FractionCircleVisual fraction={currentStep.fractionA} />
                  </div>
                ) : (
                  <FractionBarVisual
                    fraction={currentStep.fractionA}
                    highlightColor="#101827"
                    label={`${currentStep.fractionA.numerator}/${currentStep.fractionA.denominator}`}
                  />
                )}
                {currentStep.fractionB && (
                  <FractionBarVisual
                    fraction={currentStep.fractionB}
                    highlightColor="#3B82F6"
                    label={`${currentStep.fractionB.numerator}/${currentStep.fractionB.denominator}`}
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={stepIdx === 0}
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                {language === 'kn' ? 'ಹಿಂದಿನದು' : 'Previous Step'}
              </button>

              {stepIdx + 1 < activeLesson.steps.length ? (
                <button
                  type="button"
                  onClick={() => setStepIdx((i) => i + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <span>{language === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : 'Next Step'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <span>{language === 'kn' ? 'ಅಭ್ಯಾಸಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ' : 'Move to Targeted Practice'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </section>

          {/* Interactive Sandbox Matching the Student's Assigned Path */}
          <section className="lg:col-span-7">
            {activeLesson.interactiveSandbox === 'equivalent_explorer' && (
              <EquivalentFractionExplorer language={language} />
            )}
            {activeLesson.interactiveSandbox === 'comparison_lab' && (
              <FractionComparisonLab language={language} />
            )}
            {activeLesson.interactiveSandbox === 'part_whole_builder' && (
              <PartWholeBuilder language={language} />
            )}
          </section>
        </div>
      )}

      {/* STAGE 2: TARGETED EXERCISES */}
      {activeTab === 'practice' && currentExercise && (
        <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              {language === 'kn'
                ? `ಗುರಿ ಅಭ್ಯಾಸ ${exIdx + 1} / ${targetedExercises.length}`
                : `Targeted Exercise ${exIdx + 1} of ${targetedExercises.length}`}
            </span>
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showHint ? t('hideHint', language) : t('showHint', language)}</span>
            </button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900">
            {language === 'kn' ? currentExercise.promptKn : currentExercise.promptEn}
          </h2>

          {showHint && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-slate-800">
              <span className="font-bold">Hint: </span>
              {language === 'kn' ? currentExercise.hintKn : currentExercise.hintEn}
            </div>
          )}

          <QuestionVisual visualSpec={currentExercise.visualSpec} />

          <div className="mt-4 space-y-2.5">
            {currentExercise.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;
              const showRes = submittedOpt !== null;
              let cls = 'border-slate-200 bg-white hover:border-slate-300';
              if (showRes) {
                if (opt.isCorrect) cls = 'border-emerald-500 bg-emerald-50/70';
                else if (isSelected) cls = 'border-rose-400 bg-rose-50/70';
              } else if (isSelected) {
                cls = 'border-blue-600 bg-blue-50/60';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={showRes}
                  onClick={() => setSelectedOptId(opt.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium text-slate-900 transition-colors ${cls}`}
                >
                  <span>{language === 'kn' ? opt.labelKn : opt.labelEn}</span>
                  {showRes && opt.isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  {showRes && isSelected && !opt.isCorrect && (
                    <XCircle className="h-4 w-4 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {submittedOpt && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
              <div className="font-bold">
                {submittedOpt.isCorrect
                  ? language === 'kn'
                    ? 'ಅತ್ಯುತ್ತಮ!'
                    : 'Well done!'
                  : language === 'kn'
                  ? 'ಪರಿಶೀಲಿಸಿ:'
                  : 'Review:'}
              </div>
              <p className="mt-1 leading-relaxed">
                {language === 'kn' ? currentExercise.explanationKn : currentExercise.explanationEn}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            {!submittedOpt ? (
              <button
                type="button"
                disabled={!selectedOptId}
                onClick={() => void handleSubmitExercise()}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-45"
              >
                {t('submitAnswer', language)}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextExercise}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <span>
                  {exIdx + 1 < targetedExercises.length
                    ? t('nextQuestion', language)
                    : t('startReassessment', language)}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* STAGE 3: REASSESSMENT & MASTERY UPDATE */}
      {activeTab === 'reassessment' && (
        <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          {reCompletedCount >= reassessmentQuestions.length && reSubmittedOpt ? (
            <div>
              <p className="text-xs font-semibold text-emerald-700">
                {language === 'kn' ? 'ಮರುಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Reassessment Complete'}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
                {language === 'kn'
                  ? `${conceptMeta.titleKn} — ಪ್ರಾವೀಣ್ಯತೆ ನವೀಕರಿಸಲಾಗಿದೆ`
                  : `${conceptMeta.titleEn} — Mastery Updated`}
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Reassessment Score</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                    {reCorrectCount}/{reassessmentQuestions.length}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Updated Concept Mastery</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                    {updatedConceptMastery?.accuracy ?? 0}%
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">New Mastery Level</div>
                  <div className="mt-1 text-lg font-bold capitalize text-emerald-700">
                    {updatedConceptMastery?.level ?? 'developing'}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('student-hub')}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {language === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಕೇಂದ್ರಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'View Updated Student Hub'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('teacher-dashboard')}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t('teacherAccess', language)}
                </button>
              </div>
            </div>
          ) : (
            currentReQuestion && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>
                    {language === 'kn'
                      ? `ಮರುಮೌಲ್ಯಮಾಪನ ${reIdx + 1} / ${reassessmentQuestions.length}`
                      : `Reassessment ${reIdx + 1} of ${reassessmentQuestions.length}`}
                  </span>
                  <span className="font-mono">
                    {language === 'kn' ? conceptMeta.titleKn : conceptMeta.titleEn}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {language === 'kn' ? currentReQuestion.promptKn : currentReQuestion.promptEn}
                </h2>

                <QuestionVisual visualSpec={currentReQuestion.visualSpec} />

                <div className="mt-4 space-y-2.5">
                  {currentReQuestion.options.map((opt) => {
                    const isSelected = reSelectedOptId === opt.id;
                    const showRes = reSubmittedOpt !== null;
                    let cls = 'border-slate-200 bg-white hover:border-slate-300';
                    if (showRes) {
                      if (opt.isCorrect) cls = 'border-emerald-500 bg-emerald-50/70';
                      else if (isSelected) cls = 'border-rose-400 bg-rose-50/70';
                    } else if (isSelected) {
                      cls = 'border-blue-600 bg-blue-50/60';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={showRes}
                        onClick={() => setReSelectedOptId(opt.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium text-slate-900 transition-colors ${cls}`}
                      >
                        <span>{language === 'kn' ? opt.labelKn : opt.labelEn}</span>
                        {showRes && opt.isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                        {showRes && isSelected && !opt.isCorrect && (
                          <XCircle className="h-4 w-4 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {reSubmittedOpt && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
                    {language === 'kn'
                      ? currentReQuestion.explanationKn
                      : currentReQuestion.explanationEn}
                  </div>
                )}

                <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                  {!reSubmittedOpt ? (
                    <button
                      type="button"
                      disabled={!reSelectedOptId}
                      onClick={() => void handleSubmitReassessment()}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-45"
                    >
                      {t('submitAnswer', language)}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextReassessment}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <span>{t('nextQuestion', language)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </section>
      )}
    </main>
  );
};
