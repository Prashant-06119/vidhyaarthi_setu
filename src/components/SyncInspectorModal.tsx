import React from 'react';
import { CheckCircle2, Clock, CloudOff, Database, RefreshCw, X } from 'lucide-react';
import { SyncExecutionResult } from '../services/syncService';
import { ConnectivitySyncState, Language, SyncQueueItem } from '../types/domain';

interface SyncInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isEffectiveOnline: boolean;
  simulatedOffline: boolean;
  syncState: ConnectivitySyncState;
  syncQueue: SyncQueueItem[];
  lastSyncedAt: string | null;
  lastSyncResult: SyncExecutionResult | null;
  supabaseConfigured: boolean;
  isSyncing: boolean;
  onSyncNow: () => void;
  onToggleSimulatedOffline: () => void;
}

export const SyncInspectorModal: React.FC<SyncInspectorModalProps> = ({
  isOpen,
  onClose,
  language,
  isEffectiveOnline,
  simulatedOffline,
  syncState,
  syncQueue,
  lastSyncedAt,
  lastSyncResult,
  supabaseConfigured,
  isSyncing,
  onSyncNow,
  onToggleSimulatedOffline,
}) => {
  if (!isOpen) return null;

  const pendingItems = syncQueue.filter((i) => i.status === 'PENDING');
  const syncedItems = syncQueue.filter((i) => i.status === 'SYNCED');
  const recentItems = [...syncQueue]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 12);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-modal-title"
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="sync-modal-title" className="text-lg font-bold text-slate-900">
              {language === 'kn'
                ? 'ಸ್ಥಳೀಯ-ಮೊದಲು ಸಿಂಕ್ರೊನೈಸೇಶನ್ ಸರದಿ'
                : 'Local-First Synchronization Queue'}
            </h2>
            <p className="text-xs text-slate-500">
              {supabaseConfigured
                ? 'Cloud Backend: Supabase PostgreSQL Configured'
                : 'Demo Sync Adapter Active (No remote Supabase credentials configured — works 100% locally)'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sync inspector"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Status Summary Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">Status</div>
              <div className="mt-1 flex items-center gap-2 font-mono text-sm font-bold text-slate-900">
                {syncState === 'OFFLINE' && <CloudOff className="h-4 w-4 text-amber-600" />}
                {syncState === 'PENDING_SYNC' && <Clock className="h-4 w-4 text-blue-600" />}
                {syncState === 'SYNCED' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                <span>{syncState}</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">Pending Events</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {pendingItems.length}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">Synced Events</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {syncedItems.length}
              </div>
            </div>
          </div>

          {lastSyncResult && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-950">
              <span className="font-semibold">Latest Sync Result: </span>
              {lastSyncResult.message}
              {lastSyncResult.skippedDuplicateCount > 0 && (
                <span>
                  {' '}
                  (Prevented {lastSyncResult.skippedDuplicateCount} duplicate submissions)
                </span>
              )}
            </div>
          )}

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-600">
              <div className="font-semibold text-slate-900">
                {isEffectiveOnline
                  ? 'Connectivity available — ready to synchronize unique events'
                  : simulatedOffline
                  ? 'Simulated Offline Mode active — events are stored safely in IndexedDB'
                  : 'Browser is offline — events queued locally in IndexedDB'}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                Last Synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Never'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleSimulatedOffline}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {simulatedOffline ? 'Restore Connectivity' : 'Simulate Offline'}
              </button>
              <button
                type="button"
                disabled={!isEffectiveOnline || isSyncing || pendingItems.length === 0}
                onClick={onSyncNow}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : `Sync Queue (${pendingItems.length})`}
              </button>
            </div>
          </div>

          {/* Event Queue Log */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-slate-500" />
                Recent Local Events (Deduplicated by Unique Event ID)
              </span>
              <span className="font-mono text-slate-500">{syncQueue.length} total</span>
            </div>

            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {recentItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No events recorded yet.
                </div>
              ) : (
                recentItems.map((item) => (
                  <div
                    key={item.eventId}
                    className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] font-medium text-slate-900 truncate max-w-[260px]">
                        {item.eventId}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.studentId} · {item.eventType} ·{' '}
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] font-semibold">
                      {item.status === 'PENDING' ? (
                        <span className="text-blue-700">PENDING_SYNC</span>
                      ) : (
                        <span className="text-emerald-700">
                          SYNCED ({item.syncAdapter === 'supabase-postgres' ? 'Supabase' : 'Demo Adapter'})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
