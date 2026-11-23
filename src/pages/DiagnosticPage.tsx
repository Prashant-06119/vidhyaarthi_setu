import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, PlayCircle, TriangleAlert, XCircle } from 'lucide-react';
import { QuestionVisual } from '../components/visuals/QuestionVisual';
import { t } from '../data/i18n';
import { DIAGNOSTIC_QUESTIONS } from '../data/questions/diagnosticQuestions';
import { CONCEPT_METADATA, MISCONCEPTION_METADATA } from '../engine/thresholds';
import {
  AppView,
  AttemptPhase,
  FractionConceptId,
  Language,
  MisconceptionId,
  QuestionOption,
  StudentAdaptiveSnapshot,
} from '../types/domain';

interface DiagnosticPageProps {
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
  onLogBatchAttempts: (
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
  ) => Promise<void>;
  onNavigate: (view: AppView) => void;
}

export const DiagnosticPage: React.FC<DiagnosticPageProps> = ({
  language,
  snapshot,
  onLogAttempt,
  onLogBatchAttempts,
  onNavigate,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submittedOption, setSubmittedOption] = useState<QuestionOption | null>(null);
  const [sessionId, setSessionId] = useState(() => `diag-${Date.now()}`);
  const [showSummary, setShowSummary] = useState(false);

  // Reset question flow cleanly when switching students
  useEffect(() => {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setSubmittedOption(null);
    setSessionId(`diag-${snapshot.student.id}-${Date.now()}`);
    setShowSummary(false);
  }, [snapshot.student.id]);

  const currentQ = DIAGNOSTIC_QUESTIONS[questionIndex];
  const progressPct = Math.round(
    ((questionIndex + (submittedOption ? 1 : 0)) / DIAGNOSTIC_QUESTIONS.length) * 100
  );

  const handleSubmitCurrent = async () => {
    if (!selectedOptionId || submittedOption) return;
    const option = currentQ.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    await onLogAttempt({
      studentId: snapshot.student.id,
      sessionId,
      questionId: currentQ.id,
      conceptId: currentQ.conceptId,
      selectedOptionId: option.id,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
      phase: 'diagnostic',
    });

    setSubmittedOption(option);
  };

  const handleNext = () => {
    if (questionIndex + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setSubmittedOption(null);
    } else {
      setShowSummary(true);
    }
  };

  /**
   * Demo-mode helper so a hackathon judge can either answer all 10 questions manually
   * OR run a 1-click realistic Student A diagnostic session (strong basics, repeated
   * 'add_numerator_denominator_same' errors on dq-5, dq-6, dq-7).
   */
  const handleRunDemoEquivalentScenario = async () => {
    const batch = DIAGNOSTIC_QUESTIONS.map((q) => {
      if (q.conceptId === 'equivalent_fractions') {
        const trap =
          q.options.find((o) => o.misconceptionId === 'add_numerator_denominator_same') ??
          q.options[1];
        return {
          studentId: snapshot.student.id,
          sessionId,
          questionId: q.id,
          conceptId: q.conceptId,
          selectedOptionId: trap.id,
          isCorrect: trap.isCorrect,
          misconceptionId: trap.misconceptionId,
          phase: 'diagnostic' as AttemptPhase,
        };
      }
      const correct = q.options.find((o) => o.isCorrect) ?? q.options[0];
      return {
        studentId: snapshot.student.id,
        sessionId,
        questionId: q.id,
        conceptId: q.conceptId,
        selectedOptionId: correct.id,
        isCorrect: correct.isCorrect,
        misconceptionId: correct.misconceptionId,
        phase: 'diagnostic' as AttemptPhase,
      };
    });

    await onLogBatchAttempts(batch);
    setShowSummary(true);
  };

  if (showSummary) {
    const activeGaps = snapshot.misconceptions.filter((m) => m.isConfirmedGap && !m.resolved);
    const watchItems = snapshot.misconceptions.filter((m) => m.isWatchItem && !m.isConfirmedGap);

    return (
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-semibold text-blue-600">
                {language === 'kn' ? 'ಮೌಲ್ಯಮಾಪನ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Diagnostic Evaluation Complete'}
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
                {language === 'kn'
                  ? `${snapshot.student.nameKn} — ಭಿನ್ನರಾಶಿ ಕಲಿಕಾ ವರದಿ`
                  : `${snapshot.student.name} — Fractions Diagnostic Report`}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">
                {language === 'kn' ? 'ಒಟ್ಟು ಪ್ರಾವೀಣ್ಯತೆ' : 'Overall Mastery'}
              </div>
              <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                {snapshot.overallAccuracy}%
              </div>
            </div>
          </div>

          {/* Concept Breakdown */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {snapshot.masteryByConcept.map((m) => {
              const meta = CONCEPT_METADATA[m.conceptId];
              return (
                <div
                  key={m.conceptId}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {language === 'kn' ? meta.titleKn : meta.titleEn}
                    </div>
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {m.correctAttempts}/{m.totalAttempts} correct · {m.level}
                    </div>
                  </div>
                  <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                    {m.accuracy}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Confirmed Misconception Findings */}
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              {language === 'kn'
                ? 'ಪತ್ತೆಯಾದ ಪುನರಾವರ್ತಿತ ತಪ್ಪು ಕಲ್ಪನೆಗಳು'
                : 'Repeated Misconception Evidence'}
            </h2>

            {activeGaps.length === 0 ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                No repeated conceptual misconceptions detected across multiple questions.
              </div>
            ) : (
              activeGaps.map((gap) => {
                const meta = MISCONCEPTION_METADATA[gap.misconceptionId];
                return (
                  <div
                    key={gap.misconceptionId}
                    className="rounded-lg border border-amber-300 bg-amber-50 p-4"
                  >
                    <div className="flex items-start gap-2.5">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {language === 'kn' ? meta.labelKn : meta.labelEn}
                        </div>
                        <p className="mt-1 text-xs text-slate-700">
                          {language === 'kn' ? meta.diagnosisKn : meta.diagnosisEn}
                        </p>
                        <p className="mt-1.5 font-mono text-[11px] text-slate-600 tabular-nums">
                          Evidence: {gap.distinctQuestionIds.length} distinct questions (
                          {gap.distinctQuestionIds.join(', ')})
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {watchItems.length > 0 && (
              <p className="text-xs text-slate-500">
                Note: {watchItems.length} single-occurrence error(s) were noted as watch items only
                and NOT flagged as learning gaps (requires ≥ 2 distinct questions).
              </p>
            )}
          </div>

          {/* Adaptive Engine Next Step */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/70 p-5">
            <div className="text-xs font-semibold text-blue-700">
              {t('whyChosenTitle', language)}
            </div>
            <p className="mt-1.5 text-sm text-slate-800">
              {language === 'kn'
                ? snapshot.recommendation.reasonKn
                : snapshot.recommendation.reasonEn}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('learning-lab')}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <span>
                  {language === 'kn'
                    ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಪಾಠ ಮತ್ತು ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ'
                    : 'Start Recommended Visual Remediation'}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('student-hub')}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('navStudentHub', language)}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      {/* Header & Demo Simulation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-600">
            {language === 'kn' ? 'ಗ್ರೇಡ್ 6 ಭಿನ್ನರಾಶಿಗಳು · ರೋಗನಿರ್ಣಯ ಪರೀಕ್ಷೆ' : 'Grade 6 Fractions · Diagnostic Assessment'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
            {language === 'kn'
              ? `${snapshot.student.nameKn} ಅವರ ಮೌಲ್ಯಮಾಪನ`
              : `${snapshot.student.name} — Concept Diagnostic`}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => void handleRunDemoEquivalentScenario()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <PlayCircle className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          {language === 'kn'
            ? 'ಡೆಮೋ: ಸಮಾನ ಭಿನ್ನರಾಶಿ ತಪ್ಪು ಮಾದರಿ ಅನುಕರಿಸಿ'
            : 'Demo Quick-Fill: Equivalent Fractions Gap'}
        </button>
      </div>

      {/* Progress Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>
            {language === 'kn'
              ? `ಪ್ರಶ್ನೆ ${questionIndex + 1} / ${DIAGNOSTIC_QUESTIONS.length}`
              : `Question ${questionIndex + 1} of ${DIAGNOSTIC_QUESTIONS.length}`}
          </span>
          <span className="font-mono text-slate-500 tabular-nums">
            {language === 'kn'
              ? CONCEPT_METADATA[currentQ.conceptId].titleKn
              : CONCEPT_METADATA[currentQ.conceptId].titleEn}{' '}
            · {progressPct}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold leading-snug text-slate-900">
          {language === 'kn' ? currentQ.promptKn : currentQ.promptEn}
        </h2>

        <QuestionVisual visualSpec={currentQ.visualSpec} />

        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Answer options">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const showResult = submittedOption !== null;
            let borderClass = 'border-slate-200 bg-white hover:border-slate-300';
            if (showResult) {
              if (opt.isCorrect) {
                borderClass = 'border-emerald-500 bg-emerald-50/70';
              } else if (isSelected && !opt.isCorrect) {
                borderClass = 'border-rose-400 bg-rose-50/70';
              }
            } else if (isSelected) {
              borderClass = 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600/20';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={showResult}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium text-slate-900 transition-colors ${borderClass}`}
              >
                <span>{language === 'kn' ? opt.labelKn : opt.labelEn}</span>
                {showResult && opt.isCorrect && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                )}
                {showResult && isSelected && !opt.isCorrect && (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback */}
        {submittedOption && (
          <div
            className={`mt-5 rounded-xl border p-4 text-sm ${
              submittedOption.isCorrect
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                : 'border-amber-200 bg-amber-50/70 text-slate-900'
            }`}
          >
            <div className="font-bold">
              {submittedOption.isCorrect
                ? language === 'kn'
                  ? 'ಸರಿ ಉತ್ತರ!'
                  : 'Correct'
                : language === 'kn'
                ? 'ವಿವರಣೆ:'
                : 'Explanation'}
            </div>
            <p className="mt-1 text-xs leading-relaxed">
              {language === 'kn' ? currentQ.explanationKn : currentQ.explanationEn}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          {!submittedOption ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={() => void handleSubmitCurrent()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45 transition-colors"
            >
              {t('submitAnswer', language)}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <span>
                {questionIndex + 1 < DIAGNOSTIC_QUESTIONS.length
                  ? t('nextQuestion', language)
                  : t('finishDiagnostic', language)}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
};
