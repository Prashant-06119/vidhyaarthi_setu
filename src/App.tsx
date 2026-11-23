/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { SyncInspectorModal } from './components/SyncInspectorModal';
import { TopBar } from './components/TopBar';
import { WorkspaceUtilityBar } from './components/WorkspaceUtilityBar';
import { useVidyaarthiStore } from './hooks/useVidyaarthiStore';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { LearningLabPage } from './pages/LearningLabPage';
import { StudentHubPage } from './pages/StudentHubPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { WelcomePage } from './pages/WelcomePage';
import { AppView } from './types/domain';

export default function App() {
  const store = useVidyaarthiStore();
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setCurrentView('student-hub');
    }
  }, []);

  const handleStartDemo = () => {
    setCurrentView('student-hub');
  };

  const handleSelectStudentAndStart = async (studentId: string) => {
    await store.switchStudent(studentId);
    setCurrentView('student-hub');
  };

  if (store.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="font-display text-lg font-bold text-slate-900">Vidyaarthi Setu</div>
          <p className="mt-1 text-xs text-slate-500">Loading offline IndexedDB workspace...</p>
        </div>
      </div>
    );
  }

  if (store.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 text-center">
          <h1 className="font-display text-lg font-bold text-slate-900">
            Local Storage Initialization Error
          </h1>
          <p className="mt-2 text-sm text-slate-600">{store.error}</p>
          <button
            type="button"
            onClick={() => void store.resetDemo()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            Reset Local Database
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <TopBar
        currentView={currentView}
        onNavigate={setCurrentView}
        onStartDemo={handleStartDemo}
        language={store.language}
      />

      <WorkspaceUtilityBar
        students={store.students}
        activeStudentId={store.activeStudentId}
        onSwitchStudent={(id) => void store.switchStudent(id)}
        language={store.language}
        onChangeLanguage={(lang) => void store.setLanguage(lang)}
        isEffectiveOnline={store.isEffectiveOnline}
        simulatedOffline={store.simulatedOffline}
        onToggleSimulatedOffline={() => void store.toggleSimulatedOffline()}
        syncState={store.syncState}
        pendingCount={store.pendingSyncItems.length}
        onOpenSyncDrawer={() => setSyncModalOpen(true)}
        onSyncNow={() => void store.syncNow()}
        isSyncing={store.isSyncing}
        onResetDemo={() => void store.resetDemo()}
      />

      <div className="flex-1">
        {currentView === 'welcome' && (
          <WelcomePage
            language={store.language}
            snapshots={store.studentSnapshots}
            activeStudentId={store.activeStudentId}
            isEffectiveOnline={store.isEffectiveOnline}
            onSelectStudentAndStart={(id) => void handleSelectStudentAndStart(id)}
            onStartDemo={handleStartDemo}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'student-hub' && store.activeSnapshot && (
          <StudentHubPage
            language={store.language}
            snapshot={store.activeSnapshot}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'diagnostic' && store.activeSnapshot && (
          <DiagnosticPage
            language={store.language}
            snapshot={store.activeSnapshot}
            onLogAttempt={store.logAttempt}
            onLogBatchAttempts={store.logBatchAttempts}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'learning-lab' && store.activeSnapshot && (
          <LearningLabPage
            language={store.language}
            snapshot={store.activeSnapshot}
            onLogAttempt={store.logAttempt}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'teacher-dashboard' && (
          <TeacherDashboardPage
            language={store.language}
            snapshots={store.studentSnapshots}
            commonGaps={store.commonLearningGaps}
            interventions={store.interventions}
            attempts={store.attempts}
            syncQueue={store.syncQueue}
            onMarkInterventionCompleted={store.markInterventionCompleted}
            onSelectStudent={(id) => void store.switchStudent(id)}
            onNavigate={setCurrentView}
          />
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:px-6">
          <span>Vidyaarthi Setu · wHACKiest 2026 · UnlockED Mystery Track</span>
          <span>Offline-First Adaptive Mathematics MVP · Grade 6 Fractions (EN / ಕನ್ನಡ)</span>
        </div>
      </footer>

      <SyncInspectorModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        language={store.language}
        isEffectiveOnline={store.isEffectiveOnline}
        simulatedOffline={store.simulatedOffline}
        syncState={store.syncState}
        syncQueue={store.syncQueue}
        lastSyncedAt={store.lastSyncedAt}
        lastSyncResult={store.lastSyncResult}
        supabaseConfigured={store.supabaseConfigured}
        isSyncing={store.isSyncing}
        onSyncNow={() => void store.syncNow()}
        onToggleSimulatedOffline={() => void store.toggleSimulatedOffline()}
      />
    </div>
  );
}
