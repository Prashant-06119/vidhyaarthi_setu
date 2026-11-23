import Dexie, { Table } from 'dexie';
import {
  AttemptRecord,
  Language,
  StudentProfile,
  SyncQueueItem,
  TeacherIntervention,
} from '../types/domain';
import {
  DEMO_STUDENTS,
  SEED_ATTEMPTS,
  SEED_INTERVENTIONS,
  SEED_SYNC_QUEUE,
} from '../data/demoStudents/seedProfiles';
import { AppSettingRecord, LOCAL_DB_NAME, LOCAL_DB_VERSION } from './schema';

export class VidyaarthiSetuDB extends Dexie {
  students!: Table<StudentProfile, string>;
  attempts!: Table<AttemptRecord, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  interventions!: Table<TeacherIntervention, string>;
  appSettings!: Table<AppSettingRecord, string>;

  constructor() {
    super(LOCAL_DB_NAME);
    this.version(LOCAL_DB_VERSION).stores({
      students: 'id, grade, name',
      attempts: 'eventId, studentId, conceptId, phase, syncStatus, timestamp',
      syncQueue: 'eventId, studentId, status, createdAt',
      interventions: 'id, gapKey, conceptId, status',
      appSettings: 'key',
    });
  }
}

export const db = new VidyaarthiSetuDB();

export function createUniqueEventId(prefix = 'evt'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Ensures the local IndexedDB is populated with deterministic demo data
 * on first launch without overwriting existing student progress on refresh.
 */
export async function ensureDemoDataSeeded(): Promise<void> {
  const existingCount = await db.students.count();
  if (existingCount > 0) {
    return;
  }

  await db.transaction(
    'rw',
    [db.students, db.attempts, db.syncQueue, db.interventions, db.appSettings],
    async () => {
      await db.students.bulkPut(DEMO_STUDENTS);
      await db.attempts.bulkPut(SEED_ATTEMPTS);
      await db.syncQueue.bulkPut(SEED_SYNC_QUEUE);
      if (SEED_INTERVENTIONS.length > 0) {
        await db.interventions.bulkPut(SEED_INTERVENTIONS);
      }
      await db.appSettings.bulkPut([
        { key: 'activeStudentId', value: DEMO_STUDENTS[0].id },
        { key: 'language', value: 'en' },
        { key: 'simulatedOffline', value: 'false' },
        { key: 'lastSyncedAt', value: '2026-11-21T10:10:00.000Z' },
      ]);
    }
  );
}

/**
 * Resets all local student attempts, sync queue items, and teacher interventions
 * back to the repeatable hackathon demonstration baseline.
 */
export async function resetDemoDatabase(): Promise<void> {
  await db.transaction(
    'rw',
    [db.students, db.attempts, db.syncQueue, db.interventions, db.appSettings],
    async () => {
      await db.students.clear();
      await db.attempts.clear();
      await db.syncQueue.clear();
      await db.interventions.clear();

      await db.students.bulkPut(DEMO_STUDENTS);
      await db.attempts.bulkPut(SEED_ATTEMPTS);
      await db.syncQueue.bulkPut(SEED_SYNC_QUEUE);
      await db.appSettings.bulkPut([
        { key: 'activeStudentId', value: DEMO_STUDENTS[0].id },
        { key: 'simulatedOffline', value: 'false' },
        { key: 'lastSyncedAt', value: '2026-11-21T10:10:00.000Z' },
      ]);
    }
  );
}

export async function getAppSetting(key: string): Promise<string | null> {
  const row = await db.appSettings.get(key);
  return row?.value ?? null;
}

export async function setAppSetting(key: string, value: string): Promise<void> {
  await db.appSettings.put({ key, value });
}

export async function getSavedLanguage(): Promise<Language> {
  const lang = await getAppSetting('language');
  return lang === 'kn' ? 'kn' : 'en';
}
