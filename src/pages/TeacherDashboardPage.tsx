import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, ClipboardList, Users } from 'lucide-react';
import { t } from '../data/i18n';
import { CONCEPT_METADATA, MISCONCEPTION_METADATA } from '../engine/thresholds';
import {
  AppView,
  AttemptRecord,
  CommonLearningGap,
  Language,
  StudentAdaptiveSnapshot,
  SyncQueueItem,
  TeacherIntervention,
} from '../types/domain';

interface TeacherDashboardPageProps {
  language: Language;
  snapshots: StudentAdaptiveSnapshot[];
  commonGaps: CommonLearningGap[];
  interventions: TeacherIntervention[];
  attempts: AttemptRecord[];
  syncQueue: SyncQueueItem[];
  onMarkInterventionCompleted: (gap: CommonLearningGap) => Promise<void>;
  onSelectStudent: (studentId: string) => void;
  onNavigate: (view: AppView) => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
  language,
  snapshots,
  commonGaps,
  interventions,
  attempts,
  syncQueue,
  onMarkInterventionCompleted,
  onSelectStudent,
  onNavigate,
}) => {
  const studentsNeedingSupport = snapshots.filter((s) => s.needsSupport);
  const pendingSyncCount = syncQueue.filter((i) => i.status === 'PENDING').length;

  const chartData = (
    [
      'numerator_denominator',
      'fraction_representation',
      'equivalent_fractions',
      'comparing_fractions',
    ] as const
  ).map((conceptId) => {
    const row: Record<string, string | number> = {
      concept:
        language === 'kn'
          ? CONCEPT_METADATA[conceptId].shortKn
          : CONCEPT_METADATA[conceptId].shortEn,
    };
    snapshots.forEach((snap) => {
      const m = snap.masteryByConcept.find((c) => c.conceptId === conceptId);
      row[snap.student.name] = m?.hasEvidence ? m.accuracy : 0;
    });
    return row;
  });

  const recentAttempts = [...attempts]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-600">
            {language === 'kn'
              ? 'ಶಿಕ್ಷಕರ ತರಗತಿ ವಿಶ್ಲೇಷಣೆ · ಡೆಮೋ ತರಗತಿ 6'
              : 'Teacher Intelligence · Grade 6 Demo Classroom'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
            {t('teacherAccess', language)}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            All metrics below are computed deterministically from local student assessment records.
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-medium text-slate-500">
            {language === 'kn' ? 'ಒಟ್ಟು ಡೆಮೋ ವಿದ್ಯಾರ್ಥಿಗಳು' : 'Total Demo Students'}
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {snapshots.length}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-medium text-slate-500">
            {language === 'kn' ? 'ಬೆಂಬಲ ಅಗತ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳು' : 'Students Needing Support'}
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-amber-700 tabular-nums">
            {studentsNeedingSupport.length}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-medium text-slate-500">
            {language === 'kn' ? 'ಪತ್ತೆಯಾದ ಕಲಿಕಾ ಅಂತರಗಳು' : 'Identified Learning Gaps'}
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {commonGaps.length}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-medium text-slate-500">
            {language === 'kn' ? 'ಸಿಂಕ್ ಬಾಕಿ ಘಟನೆಗಳು' : 'Unsynced Local Events'}
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-blue-600 tabular-nums">
            {pendingSyncCount}
          </div>
        </div>
      </section>

      {/* Concept-Wise Mastery Chart + Common Learning Gaps */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {language === 'kn'
              ? 'ಪರಿಕಲ್ಪನೆ ಆಧಾರಿತ ವಿದ್ಯಾರ್ಥಿ ಪ್ರಾವೀಣ್ಯತೆ (%)'
              : 'Concept-Wise Learning Mastery (%)'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Side-by-side comparison across all 4 Grade 6 fraction sub-skills
          </p>
          <div className="mt-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="concept" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {snapshots.map((snap, idx) => (
                  <Bar
                    key={snap.student.id}
                    dataKey={snap.student.name}
                    fill={idx === 0 ? '#3B82F6' : '#101827'}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* COMMON LEARNING GAPS */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {t('commonGapsHeading', language)}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {language === 'kn'
                  ? 'ಪುನರಾವರ್ತಿತ ತಪ್ಪು ಕಲ್ಪನೆಗಳ ಆಧಾರದ ಮೇಲೆ ಗುಂಪು ಪುನರಾವರ್ತನೆ ಚಟುವಟಿಕೆಗಳು'
                  : 'Group revision activities generated from repeated misconception evidence'}
              </p>
            </div>
            <ClipboardList className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>

          <div className="mt-4 space-y-3">
            {commonGaps.length === 0 ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                No active learning gaps flagged across current demo students.
              </div>
            ) : (
              commonGaps.map((gap) => {
                const completedIntervention = interventions.find(
                  (i) => i.gapKey === gap.gapKey && i.status === 'completed'
                );
                return (
                  <div
                    key={gap.gapKey}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="text-xs font-semibold text-blue-700">
                      {gap.isSharedAcrossStudents
                        ? 'Shared Classroom Gap'
                        : 'Targeted Student Support'}{' '}
                      · {gap.affectedStudentNames.join(', ')}
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">
                      {language === 'kn' ? gap.summaryKn : gap.summaryEn}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                      <span className="font-semibold">
                        {language === 'kn' ? 'ಶಿಫಾರಸು ಚಟುವಟಿಕೆ: ' : 'Recommended Revision: '}
                      </span>
                      {language === 'kn'
                        ? gap.recommendedGroupActivityKn
                        : gap.recommendedGroupActivityEn}
                    </p>

                    <div className="mt-3 flex items-center justify-end border-t border-slate-200/70 pt-3">
                      {completedIntervention ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          {t('completedLabel', language)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void onMarkInterventionCompleted(gap)}
                          className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                          {t('markCompleted', language)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Student-Wise Progress Table */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {language === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ-ವಾರು ಪ್ರಗತಿ' : 'Student-Wise Progress & Active Support'}
          </h2>
          <Users className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Mastery</th>
                <th className="px-6 py-3">Attempts</th>
                <th className="px-6 py-3">Active Misconception / Path</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {snapshots.map((snap) => {
                const activeGap = snap.misconceptions.find(
                  (m) => m.isConfirmedGap && !m.resolved
                );
                const gapLabel = activeGap
                  ? MISCONCEPTION_METADATA[activeGap.misconceptionId].labelEn
                  : snap.diagnosticCompletedCount === 0
                  ? 'Awaiting Diagnostic'
                  : 'On Track / Remediation Applied';

                return (
                  <tr key={snap.student.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {language === 'kn' ? snap.student.nameKn : snap.student.name}
                      </div>
                      <div className="text-xs text-slate-500">Grade {snap.student.grade}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900 tabular-nums">
                      {snap.diagnosticCompletedCount > 0 ? `${snap.overallAccuracy}%` : '—'}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700 tabular-nums">
                      {snap.attempts.length}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 max-w-xs">{gapLabel}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectStudent(snap.student.id);
                          onNavigate('student-hub');
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Learning Activity */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-slate-900">
          {language === 'kn' ? 'ಇತ್ತೀಚಿನ ಕಲಿಕಾ ಚಟುವಟಿಕೆ' : 'Recent Classroom Learning Activity'}
        </h2>
        <div className="mt-4 divide-y divide-slate-100">
          {recentAttempts.length === 0 ? (
            <p className="text-xs text-slate-500">No student learning events recorded yet.</p>
          ) : (
            recentAttempts.map((att) => {
              const student = snapshots.find((s) => s.student.id === att.studentId)?.student;
              return (
                <div
                  key={att.eventId}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900">
                      {student?.name ?? att.studentId}
                    </span>{' '}
                    <span className="text-slate-500">
                      · {CONCEPT_METADATA[att.conceptId].shortEn} ({att.phase}) · Question{' '}
                      <span className="font-mono">{att.questionId}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span
                      className={
                        att.isCorrect
                          ? 'font-semibold text-emerald-700'
                          : 'font-semibold text-amber-700'
                      }
                    >
                      {att.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                    <span className="text-slate-400">
                      {att.syncStatus}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};
