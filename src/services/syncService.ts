import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { db, setAppSetting } from '../database/localDatabase';
import { AttemptRecord, SyncQueueItem, TeacherIntervention } from '../types/domain';

export interface SyncExecutionResult {
  syncedCount: number;
  skippedDuplicateCount: number;
  adapterUsed: 'supabase-postgres' | 'demo-local-adapter';
  syncedAt: string;
  message: string;
}

function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (url && anonKey && url.startsWith('http')) {
    return { url, anonKey };
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

function createSupabaseClientIfConfigured(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  return createClient(cfg.url, cfg.anonKey);
}

/**
 * Pure deduplication filter: prevents submitting any eventId that is already
 * marked SYNCED or duplicated within a batch.
 */
export function filterDeduplicatedPendingItems(items: SyncQueueItem[]): {
  toSubmit: SyncQueueItem[];
  duplicateCount: number;
} {
  const seenIds = new Set<string>();
  const toSubmit: SyncQueueItem[] = [];
  let duplicateCount = 0;

  for (const item of items) {
    if (item.status === 'SYNCED') {
      continue;
    }
    if (seenIds.has(item.eventId)) {
      duplicateCount += 1;
      continue;
    }
    seenIds.add(item.eventId);
    toSubmit.push(item);
  }

  return { toSubmit, duplicateCount };
}

/**
 * Enqueues a unique attempt record into IndexedDB and the pending sync queue.
 * Guarantees no duplicate eventId insertion.
 */
export async function recordAttemptLocally(attempt: AttemptRecord): Promise<boolean> {
  const existing = await db.syncQueue.get(attempt.eventId);
  if (existing) {
    return false;
  }

  const queueItem: SyncQueueItem = {
    eventId: attempt.eventId,
    studentId: attempt.studentId,
    eventType: 'attempt',
    payload: {
      questionId: attempt.questionId,
      conceptId: attempt.conceptId,
      selectedOptionId: attempt.selectedOptionId,
      isCorrect: attempt.isCorrect,
      misconceptionId: attempt.misconceptionId ?? null,
      phase: attempt.phase,
    },
    createdAt: attempt.timestamp,
    status: 'PENDING',
  };

  await db.transaction('rw', [db.attempts, db.syncQueue], async () => {
    await db.attempts.put(attempt);
    await db.syncQueue.put(queueItem);
  });

  return true;
}

export async function recordInterventionLocally(
  intervention: TeacherIntervention,
  eventId: string
): Promise<void> {
  const existing = await db.syncQueue.get(eventId);
  await db.transaction('rw', [db.interventions, db.syncQueue], async () => {
    await db.interventions.put(intervention);
    if (!existing) {
      await db.syncQueue.put({
        eventId,
        studentId: 'teacher-classroom',
        eventType: 'intervention_updated',
        payload: {
          interventionId: intervention.id,
          gapKey: intervention.gapKey,
          status: intervention.status,
        },
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      });
    }
  });
}

/**
 * Executes synchronization when connectivity is available.
 * - Uses Supabase PostgreSQL (`learning_events` table with unique `event_id`) when credentials are set.
 * - Uses a clearly-labelled Demo Sync Adapter locally when Supabase credentials are absent,
 *   never falsely claiming remote server synchronization occurred.
 */
export async function synchronizePendingQueue(
  isEffectiveOnline: boolean
): Promise<SyncExecutionResult> {
  if (!isEffectiveOnline) {
    throw new Error('Cannot synchronize while device is offline.');
  }

  const allItems = await db.syncQueue.toArray();
  const { toSubmit, duplicateCount } = filterDeduplicatedPendingItems(allItems);
  const nowIso = new Date().toISOString();

  if (toSubmit.length === 0) {
    return {
      syncedCount: 0,
      skippedDuplicateCount: duplicateCount,
      adapterUsed: isSupabaseConfigured() ? 'supabase-postgres' : 'demo-local-adapter',
      syncedAt: nowIso,
      message: 'All local events are already synchronized.',
    };
  }

  const supabase = createSupabaseClientIfConfigured();
  let adapterUsed: 'supabase-postgres' | 'demo-local-adapter' = 'demo-local-adapter';

  if (supabase) {
    const rows = toSubmit.map((item) => ({
      event_id: item.eventId,
      student_id: item.studentId,
      event_type: item.eventType,
      payload: item.payload,
      client_created_at: item.createdAt,
    }));

    const { error } = await supabase
      .from('learning_events')
      .upsert(rows, { onConflict: 'event_id', ignoreDuplicates: true });

    if (error) {
      throw new Error(`Supabase sync failed: ${error.message}`);
    }
    adapterUsed = 'supabase-postgres';
  }

  await db.transaction('rw', [db.syncQueue, db.attempts, db.appSettings], async () => {
    for (const item of toSubmit) {
      await db.syncQueue.update(item.eventId, {
        status: 'SYNCED',
        syncedAt: nowIso,
        syncAdapter: adapterUsed,
      });
      if (item.eventType === 'attempt') {
        await db.attempts.update(item.eventId, { syncStatus: 'SYNCED' });
      }
    }
    await setAppSetting('lastSyncedAt', nowIso);
  });

  return {
    syncedCount: toSubmit.length,
    skippedDuplicateCount: duplicateCount,
    adapterUsed,
    syncedAt: nowIso,
    message:
      adapterUsed === 'supabase-postgres'
        ? `Synced ${toSubmit.length} unique events to Supabase PostgreSQL.`
        : `Processed ${toSubmit.length} unique events via Local Demo Sync Adapter (no remote Supabase credentials configured).`,
  };
}
