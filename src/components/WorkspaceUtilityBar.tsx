import React from 'react';
import { Cloud, CloudOff, Globe, RefreshCw, RotateCcw, Users } from 'lucide-react';
import { t } from '../data/i18n';
import { ConnectivitySyncState, Language, StudentProfile } from '../types/domain';
import { PWAInstallButton } from './PWAInstallButton';

interface WorkspaceUtilityBarProps {
  students: StudentProfile[];
  activeStudentId: string;
  onSwitchStudent: (id: string) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  isEffectiveOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  syncState: ConnectivitySyncState;
  pendingCount: number;
  onOpenSyncDrawer: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  onResetDemo: () => void;
}

export const WorkspaceUtilityBar: React.FC<WorkspaceUtilityBarProps> = ({
  students,
  activeStudentId,
  onSwitchStudent,
  language,
  onChangeLanguage,
  isEffectiveOnline,
  simulatedOffline,
  onToggleSimulatedOffline,
  syncState,
  pendingCount,
  onOpenSyncDrawer,
  onSyncNow,
  isSyncing,
  onResetDemo,
}) => {
  const syncLabel =
    syncState === 'OFFLINE'
      ? 'OFFLINE'
      : syncState === 'PENDING_SYNC'
      ? `PENDING SYNC (${pendingCount})`
      : 'SYNCED';

  return (
    <div className="border-b border-slate-200 bg-slate-50/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Shared Device Student Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Users className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            {language === 'kn' ? 'ಸಾಧನದ ವಿದ್ಯಾರ್ಥಿ:' : 'Active Student:'}
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 p-0.5">
            {students.map((s) => {
              const active = s.id === activeStudentId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSwitchStudent(s.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'kn' ? s.nameKn : s.name} · Gr {s.grade}
                </button>
              );
            })}
          </div>
        </div>

        {/* Connectivity, Sync, Language & Demo Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Segmented Control */}
          <div
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5"
            role="group"
            aria-label="Language selector"
          >
            <Globe className="ml-1.5 h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                language === 'en'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('kn')}
              className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                language === 'kn'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Offline Toggle */}
          <button
            type="button"
            onClick={onToggleSimulatedOffline}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              !isEffectiveOnline
                ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isEffectiveOnline ? (
              <Cloud className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            ) : (
              <CloudOff className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
            )}
            <span>
              {simulatedOffline
                ? t('restoreOnline', language)
                : t('simulateOffline', language)}
            </span>
          </button>

          {/* Sync Status & Queue Inspector Trigger */}
          <button
            type="button"
            onClick={onOpenSyncDrawer}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              syncState === 'OFFLINE'
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : syncState === 'PENDING_SYNC'
                ? 'border-blue-300 bg-blue-50 text-blue-900'
                : 'border-emerald-300 bg-emerald-50 text-emerald-900'
            }`}
          >
            <span>{syncLabel}</span>
          </button>

          {isEffectiveOnline && pendingCount > 0 && (
            <button
              type="button"
              disabled={isSyncing}
              onClick={onSyncNow}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {t('syncNow', language)}
            </button>
          )}

          <PWAInstallButton language={language} />

          <button
            type="button"
            onClick={onResetDemo}
            title={t('resetDemo', language)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sm:hidden">{language === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
            <span className="hidden sm:inline">{t('resetDemo', language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
