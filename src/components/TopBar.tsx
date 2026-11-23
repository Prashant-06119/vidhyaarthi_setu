import React from 'react';
import { t } from '../data/i18n';
import { AppView, Language } from '../types/domain';

interface TopBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onStartDemo: () => void;
  language: Language;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  onStartDemo,
  language,
}) => {
  const navItems: Array<{ id: AppView; label: string }> = [
    { id: 'welcome', label: t('navWelcome', language) },
    { id: 'student-hub', label: t('navStudentHub', language) },
    { id: 'diagnostic', label: t('navDiagnostic', language) },
    { id: 'learning-lab', label: t('navLearningLab', language) },
    { id: 'teacher-dashboard', label: t('navTeacher', language) },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="font-display text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {t('brandName', language)}
        </button>

        {/* Zone 2: 5 single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors border-b-2 ${
                  active
                    ? 'border-blue-600 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={
              currentView === 'welcome'
                ? onStartDemo
                : () =>
                    onNavigate(
                      currentView === 'teacher-dashboard' ? 'student-hub' : 'teacher-dashboard'
                    )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {currentView === 'welcome'
              ? t('startDemo', language)
              : currentView === 'teacher-dashboard'
              ? t('navStudentHub', language)
              : t('teacherAccess', language)}
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <nav
        aria-label="Mobile navigation"
        className="flex md:hidden items-center justify-between gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2 text-[11px] font-medium"
      >
        {navItems.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 ${
                active ? 'text-blue-600 font-semibold' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
