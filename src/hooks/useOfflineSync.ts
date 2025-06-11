
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';

interface PendingOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

export const useOfflineSync = () => {
  const { user } = useAuth();
  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Carregar operações pendentes do localStorage
  useEffect(() => {
    if (!user) return;

    const saved = localStorage.getItem(`pending_ops_${user.id}`);
    if (saved) {
      try {
        setPendingOperations(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar operações pendentes:', error);
      }
    }
  }, [user]);

  // Salvar operações pendentes no localStorage
  const savePendingOperations = (operations: PendingOperation[]) => {
    if (!user) return;
    
    localStorage.setItem(`pending_ops_${user.id}`, JSON.stringify(operations));
    setPendingOperations(operations);
  };

  // Adicionar operação pendente
  const addPendingOperation = (
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any
  ) => {
    const newOp: PendingOperation = {
      id: crypto.randomUUID(),
      table,
      operation,
      data,
      timestamp: Date.now()
    };

    const updated = [...pendingOperations, newOp];
    savePendingOperations(updated);
  };

  // Sincronizar operações pendentes quando voltar online
  const syncPendingOperations = async () => {
    if (!user || pendingOperations.length === 0 || isSyncing) return;

    setIsSyncing(true);
    console.log(`Sincronizando ${pendingOperations.length} operações pendentes...`);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const completedOps: string[] = [];

      for (const op of pendingOperations) {
        try {
          let query;
          
          switch (op.operation) {
            case 'insert':
              query = supabase.from(op.table).insert({
                ...op.data,
                user_id: user.id
              });
              break;
              
            case 'update':
              query = supabase.from(op.table).update(op.data)
                .eq('id', op.data.id)
                .eq('user_id', user.id);
              break;
              
            case 'delete':
              query = supabase.from(op.table).delete()
                .eq('id', op.data.id)
                .eq('user_id', user.id);
              break;
              
            default:
              continue;
          }

          const { error } = await query;
          
          if (error) {
            console.error(`Erro ao sincronizar operação ${op.id}:`, error);
          } else {
            completedOps.push(op.id);
          }
        } catch (error) {
          console.error(`Erro ao executar operação ${op.id}:`, error);
        }
      }

      // Remover operações sincronizadas com sucesso
      if (completedOps.length > 0) {
        const remaining = pendingOperations.filter(op => !completedOps.includes(op.id));
        savePendingOperations(remaining);
        console.log(`${completedOps.length} operações sincronizadas com sucesso`);
      }
    } catch (error) {
      console.error('Erro durante sincronização:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sincronizar quando voltar online
  useEffect(() => {
    const handleOnline = () => {
      console.log('Conexão restabelecida, iniciando sincronização...');
      setTimeout(syncPendingOperations, 1000);
    };

    window.addEventListener('online', handleOnline);
    
    // Tentar sincronizar no carregamento se já estiver online
    if (navigator.onLine && pendingOperations.length > 0) {
      setTimeout(syncPendingOperations, 2000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [pendingOperations.length, user]);

  return {
    pendingOperations,
    addPendingOperation,
    syncPendingOperations,
    isSyncing,
    hasPendingOperations: pendingOperations.length > 0
  };
};
