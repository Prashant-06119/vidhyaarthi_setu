import { ConnectivitySyncState } from '../types/domain';

export function getBrowserOnlineStatus(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function computeEffectiveOnline(
  browserOnline: boolean,
  simulatedOffline: boolean
): boolean {
  return browserOnline && !simulatedOffline;
}

export function deriveConnectivitySyncState(
  isEffectiveOnline: boolean,
  pendingCount: number
): ConnectivitySyncState {
  if (!isEffectiveOnline) {
    return 'OFFLINE';
  }
  if (pendingCount > 0) {
    return 'PENDING_SYNC';
  }
  return 'SYNCED';
}
