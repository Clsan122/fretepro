
import React, { createContext, useContext, ReactNode } from 'react';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface SyncContextType {
  isOnline: boolean;
  hasPendingOperations: boolean;
  isSyncing: boolean;
  syncPendingOperations: () => Promise<void>;
  addPendingOperation: (table: string, operation: 'insert' | 'update' | 'delete', data: any) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};

interface SyncProviderProps {
  children: ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  const { isOnline } = useRealtimeSync();
  const { 
    hasPendingOperations, 
    isSyncing, 
    syncPendingOperations, 
    addPendingOperation 
  } = useOfflineSync();

  const value: SyncContextType = {
    isOnline,
    hasPendingOperations,
    isSyncing,
    syncPendingOperations,
    addPendingOperation
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
