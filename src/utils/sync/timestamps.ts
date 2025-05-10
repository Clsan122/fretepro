
import { TableName } from "./types";

// Obter o timestamp da última sincronização
export const getLastSyncTimestamp = (type: TableName): string => {
  const timestamp = localStorage.getItem(`last_sync_${type}`);
  if (timestamp) {
    return timestamp;
  }
  // Retornar data antiga para sincronizar todo o histórico na primeira vez
  return '2000-01-01T00:00:00.000Z';
};

// Salvar o timestamp da última sincronização
export const setLastSyncTimestamp = (type: TableName, timestamp: string): void => {
  localStorage.setItem(`last_sync_${type}`, timestamp);
};
