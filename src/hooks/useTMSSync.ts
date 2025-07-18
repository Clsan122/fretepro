import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { useTMSDevice } from './useTMSDevice';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  isSyncing: boolean;
  hasConflicts: boolean;
}

interface PendingOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  deviceFingerprint: string;
}

export const useTMSSync = () => {
  const { user } = useAuth();
  const { deviceInfo, logAccess } = useTMSDevice();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingOperations: 0,
    isSyncing: false,
    hasConflicts: false
  });
  const [pendingOps, setPendingOps] = useState<PendingOperation[]>([]);

  // Detectar status de conexão
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    setSyncStatus(prev => ({ ...prev, isOnline }));
    
    if (isOnline && pendingOps.length > 0) {
      syncPendingOperations();
    }
  };

  // Salvar operação pendente offline
  const addPendingOperation = (
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any
  ) => {
    if (!deviceInfo) return;

    const op: PendingOperation = {
      id: crypto.randomUUID(),
      table,
      operation,
      data,
      timestamp: new Date(),
      deviceFingerprint: deviceInfo.fingerprint
    };

    const newOps = [...pendingOps, op];
    setPendingOps(newOps);
    
    // Salvar no localStorage
    localStorage.setItem('tms_pending_ops', JSON.stringify(newOps));
    
    setSyncStatus(prev => ({ 
      ...prev, 
      pendingOperations: newOps.length 
    }));
  };

  // Carregar operações pendentes do localStorage
  const loadPendingOperations = () => {
    try {
      const stored = localStorage.getItem('tms_pending_ops');
      if (stored) {
        const ops = JSON.parse(stored).map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp)
        }));
        setPendingOps(ops);
        setSyncStatus(prev => ({ 
          ...prev, 
          pendingOperations: ops.length 
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar operações pendentes:', error);
    }
  };

  // Sincronizar operações pendentes
  const syncPendingOperations = async () => {
    if (!user || !syncStatus.isOnline || pendingOps.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const successfulOps: string[] = [];
      const conflicts: PendingOperation[] = [];

      for (const op of pendingOps) {
        try {
          let result;
          
          switch (op.operation) {
            case 'insert':
              result = await supabase
                .from(op.table as any)
                .insert(op.data);
              break;
              
            case 'update':
              // Verificar se o registro ainda existe e não foi modificado
              const { data: current } = await supabase
                .from(op.table as any)
                .select('sync_version, updated_at')
                .eq('id', op.data.id)
                .single();

              if (current && (current as any).sync_version > op.data.sync_version) {
                // Conflito detectado
                conflicts.push(op);
                continue;
              }

              result = await supabase
                .from(op.table as any)
                .update(op.data)
                .eq('id', op.data.id);
              break;
              
            case 'delete':
              result = await supabase
                .from(op.table as any)
                .delete()
                .eq('id', op.data.id);
              break;
          }

          if (result && !result.error) {
            successfulOps.push(op.id);
          }
        } catch (error) {
          console.error(`Erro ao sincronizar operação ${op.id}:`, error);
        }
      }

      // Remover operações sincronizadas com sucesso
      const remainingOps = pendingOps.filter(op => 
        !successfulOps.includes(op.id)
      );
      
      setPendingOps(remainingOps);
      localStorage.setItem('tms_pending_ops', JSON.stringify(remainingOps));

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingOperations: remainingOps.length,
        hasConflicts: conflicts.length > 0
      }));

      if (successfulOps.length > 0) {
        logAccess('sync_completed', {
          syncedOperations: successfulOps.length,
          remainingOperations: remainingOps.length,
          conflicts: conflicts.length
        });
      }

    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  // Forçar sincronização manual
  const forcSync = async () => {
    if (!syncStatus.isOnline) {
      throw new Error('Não é possível sincronizar offline');
    }
    
    await syncPendingOperations();
    await pullLatestData();
  };

  // Baixar dados mais recentes do servidor
  const pullLatestData = async () => {
    if (!user || !syncStatus.isOnline) return;

    try {
      const lastSyncTime = syncStatus.lastSync || new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Buscar dados atualizados desde a última sincronização
      const tables = ['clients', 'drivers', 'freights', 'collection_orders'];
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table as any)
          .select('*')
          .eq('user_id', user.id)
          .gte('updated_at', lastSyncTime.toISOString())
          .order('updated_at', { ascending: false });

        if (data && !error && data.length > 0) {
          // Salvar no cache local
          const cacheKey = `tms_cache_${table}`;
          const existingCache = JSON.parse(localStorage.getItem(cacheKey) || '[]');
          
          // Atualizar cache com dados mais recentes
          const updatedCache = [...existingCache];
          data.forEach(newItem => {
            const existingIndex = updatedCache.findIndex((item: any) => item.id === (newItem as any).id);
            if (existingIndex >= 0) {
              updatedCache[existingIndex] = newItem;
            } else {
              updatedCache.push(newItem);
            }
          });

          localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
        }
      }

      setSyncStatus(prev => ({ ...prev, lastSync: new Date() }));
    } catch (error) {
      console.error('Erro ao baixar dados:', error);
    }
  };

  // Obter dados do cache local
  const getCachedData = (table: string) => {
    try {
      const cacheKey = `tms_cache_${table}`;
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return [];
    }
  };

  // Limpar cache e operações pendentes
  const clearCache = () => {
    const tables = ['clients', 'drivers', 'freights', 'collection_orders'];
    tables.forEach(table => {
      localStorage.removeItem(`tms_cache_${table}`);
    });
    
    localStorage.removeItem('tms_pending_ops');
    setPendingOps([]);
    setSyncStatus(prev => ({ 
      ...prev, 
      pendingOperations: 0,
      hasConflicts: false 
    }));
  };

  // Configurar listeners de eventos
  useEffect(() => {
    // Carregar operações pendentes na inicialização
    loadPendingOperations();

    // Listeners de conectividade
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Sincronização automática quando voltar online
    if (navigator.onLine) {
      pullLatestData();
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Sincronização automática periódica
  useEffect(() => {
    if (!syncStatus.isOnline || !user) return;

    const interval = setInterval(() => {
      if (pendingOps.length > 0) {
        syncPendingOperations();
      }
      pullLatestData();
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [syncStatus.isOnline, user, pendingOps.length]);

  return {
    syncStatus,
    pendingOperations: pendingOps,
    addPendingOperation,
    syncPendingOperations,
    forcSync,
    pullLatestData,
    getCachedData,
    clearCache
  };
};