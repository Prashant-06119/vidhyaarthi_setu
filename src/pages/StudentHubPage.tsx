import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck, Compass, Sparkles, TriangleAlert } from 'lucide-react';
import { t } from '../data/i18n';
import { FRACTION_LESSONS } from '../data/lessons/fractionLessons';
import { CONCEPT_METADATA, MISCONCEPTION_METADATA } from '../engine/thresholds';
import {
  AppView,
  Language,
  MasteryLevel,
  StudentAdaptiveSnapshot,
} from '../types/domain';

interface StudentHubPageProps {
  language: Language;
  snapshot: StudentAdaptiveSnapshot;
  onNavigate: (view: AppView) => void;
}

function getLevelMeta(level: MasteryLevel, language: Language) {
  if (level === 'strong') {
    return {
      label: t('strongLabel', language),
      textClass: 'text-emerald-700',
      barClass: 'bg-emerald-600',
    };
  }
  if (level === 'developing') {
    return {
      label: t('developingLabel', language),
      textClass: 'text-amber-700',
      barClass: 'bg-amber-500',
    };
  }
  return {
    label: t('weakLabel', language),
    textClass: 'text-rose-700',
    barClass: 'bg-rose-600',
  };
}

export const StudentHubPage: React.FC<StudentHubPageProps> = ({
  language,
  snapshot,
  onNavigate,
}) => {
  const { student, masteryByConcept, recommendation, misconceptions, overallAccuracy } = snapshot;
  const recommendedLesson = FRACTION_LESSONS.find((l) => l.id === recommendation.lessonModuleId);
  const activeConfirmedGaps = misconceptions.filter((m) => m.isConfirmedGap && !m.resolved);
  const resolvedGaps = misconceptions.filter((m) => m.resolved);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* Student Profile Header */}
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white"
            style={{ backgroundColor: student.accentColor }}
          >
            {student.avatarInitials}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              {language === 'kn' ? student.nameKn : student.name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Grade {student.grade} · Mathematics: Fractions ·{' '}
              {language === 'kn' ? student.schoolLabelKn : student.schoolLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs font-medium text-slate-500">
              {language === 'kn' ? 'ಒಟ್ಟು ಪ್ರಾವೀಣ್ಯತೆ' : 'Overall Mastery'}
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {snapshot.diagnosticCompletedCount > 0 ? `${overallAccuracy}%` : '—'}
            </div>
          </div>

          <div className="h-9 w-px bg-slate-200" aria-hidden="true" />

          <div>
            <div className="text-xs font-medium text-slate-500">
              {language === 'kn' ? 'ಪ್ರಯತ್ನಗಳು' : 'Recorded Attempts'}
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {snapshot.attempts.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('diagnostic')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <ClipboardCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
            {snapshot.diagnosticCompletedCount > 0
              ? language === 'kn'
                ? 'ಮೌಲ್ಯಮಾಪನ ಮತ್ತೆ ತೆಗೆದುಕೊಳ್ಳಿ'
                : 'Retake Diagnostic'
              : language === 'kn'
              ? 'ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ'
              : 'Start Diagnostic Assessment'}
          </button>
        </div>
      </section>

      {/* Primary Adaptive Recommendation Panel */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>{t('whyChosenTitle', language)}</span>
            </div>
            <h2 className="mt-1.5 font-display text-xl font-bold text-slate-900">
              {recommendation.activityType === 'diagnostic_needed'
                ? language === 'kn'
                  ? 'ಹಂತ 1: ಗ್ರೇಡ್ 6 ಭಿನ್ನರಾಶಿಗಳ ಮೌಲ್ಯಮಾಪನವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ'
                  : 'Step 1: Complete Grade 6 Fractions Diagnostic Assessment'
                : recommendedLesson
                ? language === 'kn'
                  ? recommendedLesson.titleKn
                  : recommendedLesson.titleEn
                : 'Adaptive Practice'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {language === 'kn' ? recommendation.reasonKn : recommendation.reasonEn}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate(
                recommendation.activityType === 'diagnostic_needed'
                  ? 'diagnostic'
                  : 'learning-lab'
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shrink-0"
          >
            <span>
              {recommendation.activityType === 'diagnostic_needed'
                ? language === 'kn'
                  ? 'ಮೌಲ್ಯಮಾಪನ ತೆರೆಯಿರಿ'
                  : 'Open Diagnostic Assessment'
                : language === 'kn'
                ? 'ವೈಯಕ್ತಿಕ ಕಲಿಕಾ ಪ್ರಯೋಗಾಲಯ ತೆರೆಯಿರಿ'
                : 'Open Personalized Learning Lab'}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Deterministic Rule Trace */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-slate-700">
            {language === 'kn'
              ? 'ಪಾರದರ್ಶಕ ನಿಯಮ ಪರಿಶೀಲನೆ (Deterministic Rule Trace)'
              : 'Transparent Deterministic Rule Trace'}
          </h3>
          <ul className="mt-2 space-y-1.5">
            {recommendation.ruleTrace.map((line, i) => (
              <li
                key={i}
                className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Concept-Wise Mastery Grid */}
      <section>
        <h2 className="font-display text-lg font-bold text-slate-900">
          {language === 'kn'
            ? 'ಪರಿಕಲ್ಪನೆ ಆಧಾರಿತ ಪ್ರಾವೀಣ್ಯತೆ'
            : 'Concept-Wise Mastery Profile'}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {masteryByConcept.map((m) => {
            const meta = CONCEPT_METADATA[m.conceptId];
            const levelMeta = getLevelMeta(m.level, language);
            return (
              <div
                key={m.conceptId}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{language === 'kn' ? meta.shortKn : meta.shortEn}</span>
                    <span className="font-mono tabular-nums">
                      {m.totalAttempts} {language === 'kn' ? 'ಪ್ರಶ್ನೆಗಳು' : 'qs'}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-bold text-slate-900">
                    {language === 'kn' ? meta.titleKn : meta.titleEn}
                  </h3>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                      {m.hasEvidence ? `${m.accuracy}%` : '—'}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        m.hasEvidence ? levelMeta.textClass : 'text-slate-400'
                      }`}
                    >
                      {m.hasEvidence
                        ? levelMeta.label
                        : language === 'kn'
                        ? 'ಮೌಲ್ಯಮಾಪನ ಬಾಕಿ'
                        : 'Not yet assessed'}
                    </span>
                  </div>

                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all duration-300 ${
                        m.hasEvidence ? levelMeta.barClass : 'bg-slate-200'
                      }`}
                      style={{ width: `${m.hasEvidence ? m.accuracy : 0}%` }}
                    />
                  </div>

                  {m.reassessmentAttempts > 0 && (
                    <p className="mt-2 font-mono text-[11px] text-slate-500 tabular-nums">
                      Diagnostic: {m.diagnosticAccuracy ?? '—'}% · Reassessment:{' '}
                      {m.reassessmentAccuracy}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Flagged & Resolved Misconceptions */}
      {(activeConfirmedGaps.length > 0 || resolvedGaps.length > 0) && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {language === 'kn'
              ? 'ಗುರುತಿಸಲಾದ ಕಲಿಕಾ ಅಂತರಗಳು ಮತ್ತು ಪ್ರಗತಿ'
              : 'Detected Misconception Patterns'}
          </h2>
          <div className="mt-4 space-y-3">
            {activeConfirmedGaps.map((gap) => {
              const meta = MISCONCEPTION_METADATA[gap.misconceptionId];
              return (
                <div
                  key={gap.misconceptionId}
                  className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50/70 p-4"
                >
                  <div className="flex items-start gap-3">
                    <TriangleAlert
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {language === 'kn' ? meta.labelKn : meta.labelEn}
                      </div>
                      <p className="mt-1 text-xs text-slate-700">
                        {language === 'kn' ? meta.diagnosisKn : meta.diagnosisEn}
                      </p>
                      <p className="mt-1.5 font-mono text-[11px] text-slate-600 tabular-nums">
                        Observed across {gap.distinctQuestionIds.length} distinct questions (
                        {gap.distinctQuestionIds.join(', ')})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('learning-lab')}
                    className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    {language === 'kn' ? 'ಪರಿಹಾರ ಅಭ್ಯಾಸ ತೆರೆಯಿರಿ' : 'Start Targeted Practice'}
                  </button>
                </div>
              );
            })}

            {resolvedGaps.map((gap) => {
              const meta = MISCONCEPTION_METADATA[gap.misconceptionId];
              return (
                <div
                  key={gap.misconceptionId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {language === 'kn' ? meta.labelKn : meta.labelEn}
                      </div>
                      <div className="text-xs text-emerald-800">
                        {language === 'kn'
                          ? 'ಮರುಮೌಲ್ಯಮಾಪನದ ನಂತರ ಪರಿಹರಿಸಲಾಗಿದೆ'
                          : 'Resolved through visual remediation & reassessment'}
                      </div>
                    </div>
                  </div>
                  <Sparkles className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};
