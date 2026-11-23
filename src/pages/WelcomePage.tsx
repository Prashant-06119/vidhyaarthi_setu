import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Layers, WifiOff } from 'lucide-react';
import { t } from '../data/i18n';
import {
  AppView,
  Language,
  StudentAdaptiveSnapshot,
} from '../types/domain';

interface WelcomePageProps {
  language: Language;
  snapshots: StudentAdaptiveSnapshot[];
  activeStudentId: string;
  isEffectiveOnline: boolean;
  onSelectStudentAndStart: (studentId: string) => void;
  onStartDemo: () => void;
  onNavigate: (view: AppView) => void;
}

const HERO_IMAGE_PATH = '/src/assets/images/hero_vidyaarthi_learning_1795392151436.jpg';

export const WelcomePage: React.FC<WelcomePageProps> = ({
  language,
  snapshots,
  activeStudentId,
  isEffectiveOnline,
  onSelectStudentAndStart,
  onStartDemo,
  onNavigate,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Split Hero Section */}
      <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">
              {t('hackathonTag', language)}
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-balance">
              {t('brandName', language)}
            </h1>
            <p className="mt-2 text-lg font-semibold text-slate-700">
              {t('tagline', language)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-xl">
              {language === 'kn'
                ? 'ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಿಗಾಗಿ ಆಫ್‌ಲೈನ್-ಮೊದಲು ಕಲಿಕಾ ವೇದಿಕೆ. ಒಂದೇ ಹಂಚಿಕೊಂಡ ಸಾಧನದಲ್ಲಿ ವಿದ್ಯಾರ್ಥಿಗಳ ಕಲಿಕಾ ಅಂತರಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ, ದೃಶ್ಯ ಭಿನ್ನರಾಶಿ ಅಭ್ಯಾಸವನ್ನು ನೀಡಿ ಮತ್ತು ಶಿಕ್ಷಕರಿಗೆ ನಿಖರ ಮಾಹಿತಿ ಒದಗಿಸುತ್ತದೆ.'
                : 'An offline-first adaptive learning platform for rural schools. Diagnose repeated fraction misconceptions on a shared device, adapt visual practice without cloud dependency, and equip teachers with actionable classroom gap intelligence.'}
            </p>

            {/* Primary CTA Cluster */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartDemo}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>{t('startDemo', language)}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('teacher-dashboard')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                {t('teacherAccess', language)}
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>{t('demoModeLabel', language)}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>
              {isEffectiveOnline
                ? language === 'kn'
                  ? 'ಸಂಪರ್ಕ ಲಭ್ಯವಿದೆ (ಆನ್‌ಲೈನ್)'
                  : 'Connectivity Ready'
                : language === 'kn'
                ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯ'
                : 'Offline Mode Active'}
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>IndexedDB + PWA</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 lg:col-span-6 min-h-[260px]">
          {!imgFailed ? (
            <img
              src={HERO_IMAGE_PATH}
              alt="Two Grade 6 students sharing a tablet displaying colorful fraction bars and circles in a classroom"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 text-center text-white">
              <BookOpen className="h-12 w-12 text-blue-400" />
              <p className="mt-3 font-display text-lg font-bold">
                {t('brandName', language)}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Offline-First Adaptive Fractions Learning
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Shared Device Demo Profiles */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              {t('selectStudentHeading', language)}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {language === 'kn'
                ? 'ಪ್ರತಿ ವಿದ್ಯಾರ್ಥಿಯ ಪ್ರಗತಿ ಮತ್ತು ಕಲಿಕಾ ಮಾರ್ಗವು ಪ್ರತ್ಯೇಕವಾಗಿ ಸಂಗ್ರಹಿಸಲ್ಪಡುತ್ತದೆ.'
                : 'Each student profile maintains independent progress, misconception history, and adaptive recommendations in local IndexedDB.'}
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            2 Illustrative Grade 6 Profiles · Zero Sign-In Required
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          {snapshots.map((snap) => {
            const isSelected = snap.student.id === activeStudentId;
            return (
              <div
                key={snap.student.id}
                className={`flex flex-col justify-between rounded-xl border bg-white p-6 transition-colors ${
                  isSelected
                    ? 'border-blue-600 ring-1 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold text-white"
                        style={{ backgroundColor: snap.student.accentColor }}
                      >
                        {snap.student.avatarInitials}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {language === 'kn' ? snap.student.nameKn : snap.student.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Grade {snap.student.grade} ·{' '}
                          {language === 'kn'
                            ? snap.student.schoolLabelKn
                            : snap.student.schoolLabel}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                      {snap.diagnosticCompletedCount > 0
                        ? `${snap.overallAccuracy}% mastery`
                        : 'Ready for Diagnostic'}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    {language === 'kn' ? snap.student.demoFocusKn : snap.student.demoFocusEn}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {snap.attempts.length} recorded attempts
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectStudentAndStart(snap.student.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <span>
                      {language === 'kn'
                        ? `${snap.student.nameKn} ಆಗಿ ಪ್ರಾರಂಭಿಸಿ`
                        : `Continue as ${snap.student.name}`}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Architecture Pillars */}
      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <WifiOff className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">
            {language === 'kn' ? '100% ಆಫ್‌ಲೈನ್-ಮೊದಲು' : '100% Offline-First Engine'}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {language === 'kn'
              ? 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಪಾಠಗಳು, ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಅಡಾಪ್ಟಿವ್ ಅಭ್ಯಾಸಗಳು IndexedDB ಮತ್ತು PWA ಮೂಲಕ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.'
              : 'Lessons, diagnostic checks, adaptive rules, and progress persistence run completely offline using IndexedDB and Service Worker caching.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Layers className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">
            {language === 'kn'
              ? 'ತಪ್ಪು ಕಲ್ಪನೆ ಆಧಾರಿತ ಅಡಾಪ್ಟಿವ್ ಎಂಜಿನ್'
              : 'Deterministic Misconception Detection'}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {language === 'kn'
              ? 'ಒಂದು ತಪ್ಪು ಉತ್ತರವನ್ನು ಆತುರದಿಂದ ನಿರ್ಣಯಿಸದೆ, ಪ್ರತ್ಯೇಕ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಪುನರಾವರ್ತನೆಯಾದಾಗ ಮಾತ್ರ ಕಲಿಕಾ ಅಂತರವನ್ನು ಗುರುತಿಸುತ್ತದೆ.'
              : 'Flags a learning gap only after repeated misconception evidence across distinct questions, then explains the exact rule behind every recommendation.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <CheckCircle2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">
            {language === 'kn'
              ? 'ಶಿಕ್ಷಕರ ತರಗತಿ ಮಟ್ಟದ ಒಳನೋಟ'
              : 'Actionable Teacher Intelligence'}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {language === 'kn'
              ? 'ಸಾಮಾನ್ಯ ಕಲಿಕಾ ಅಂತರಗಳನ್ನು ಗುಂಪು ಮಾಡಿ ತರಗತಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ ಮತ್ತು ಹಸ್ತಕ್ಷೇಪ ಪೂರ್ಣಗೊಳಿಸಲು ಅವಕಾಶ ನೀಡುತ್ತದೆ.'
              : 'Aggregates student-wise mastery, surfaces Common Learning Gaps across the classroom, and tracks completed teacher revision interventions.'}
          </p>
        </div>
      </section>
    </main>
  );
};
