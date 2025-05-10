
// Type declarations for the service worker sync API
interface SyncManager {
  register(tag: string): Promise<void>;
}

// Now properly export this interface
export interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

// Estrutura para armazenar dados para sincronização com controle de versão
export interface SyncItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  syncId: string;
  syncVersion: number;
  _synced: boolean;
  _deleted?: boolean;
  _conflictResolved?: boolean;
}

// Tipagem para as tabelas do banco de dados
export type TableName = "clients" | "drivers" | "freights" | "freight_expenses" | "collection_orders" | "measurements";
