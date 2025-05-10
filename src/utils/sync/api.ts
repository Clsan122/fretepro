
import { TableName, SyncItem, ExtendedServiceWorkerRegistration } from "./types";
import { saveToIndexedDB, getLocalStorageData, getPendingSyncItems } from "./database";
import { syncWithServer } from "./onlineSync";
import { setupPeriodicSync, setupOnlineListener } from "./periodicSync";
import { supabase } from "@/integrations/supabase/client";

// Salvar dados para sincronização posterior com sistema distribuído
export const saveForOfflineSync = async (type: TableName, data: any): Promise<boolean> => {
  try {
    // Gerar um syncId único se não existir
    if (!data.syncId) {
      data.syncId = crypto.randomUUID();
    }
    
    // Definir versão inicial se não existir
    if (!data.syncVersion) {
      data.syncVersion = 1;
    }

    // Se estiver online, tente enviar imediatamente e armazenar localmente
    if (navigator.onLine) {
      try {
        // Se autenticado, sincronizar com Supabase
        const { data: session } = await supabase.auth.getSession();
        if (session?.session) {
          // Adicionar dados a tabela correspondente no Supabase
          const { error } = await supabase
            .from(type)
            .upsert({
              ...data,
              sync_id: data.syncId,
              sync_version: data.syncVersion
            });
            
          if (!error) {
            console.log(`Dados sincronizados com sucesso: ${type}`);
            
            // Mesmo com sucesso online, salvamos localmente para sistema distribuído
            const existingData = getLocalStorageData(type);
            existingData.push({...data, _synced: true});
            localStorage.setItem(type, JSON.stringify(existingData));
            
            return true;
          } else {
            console.error('Erro ao sincronizar com Supabase:', error);
            // Se falhou online, salvamos para sincronização posterior
          }
        }
      } catch (error) {
        console.error('Erro ao salvar dados online:', error);
      }
    }
    
    // Se offline ou falhou online, use o IndexedDB para sistema distribuído
    const syncItem: SyncItem = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now(),
      syncId: data.syncId,
      syncVersion: data.syncVersion,
      _synced: false
    };
    
    await saveToIndexedDB(syncItem);
    
    // Solicitar sincronização quando estiver online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready as ExtendedServiceWorkerRegistration;
      await registration.sync?.register('database-sync');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados para sincronização offline:', error);
    return false;
  }
};

// Verificar status de sincronização
export const checkSyncStatus = async (): Promise<{ pending: number }> => {
  try {
    if (!('indexedDB' in window)) {
      return { pending: 0 };
    }
    
    const pendingItems = await getPendingSyncItems();
    
    return { pending: pendingItems.length };
  } catch (error) {
    console.error('Erro ao verificar status de sincronização:', error);
    return { pending: 0 };
  }
};

// Função para iniciar sincronização manual
export const startManualSync = async (): Promise<{success: boolean, message: string}> => {
  try {
    if (!navigator.onLine) {
      return { success: false, message: 'Você está offline. A sincronização será realizada quando estiver online.' };
    }
    
    const result = await syncWithServer();
    
    if (result) {
      return { success: true, message: 'Sincronização concluída com sucesso!' };
    } else {
      return { success: false, message: 'Ocorreu um erro durante a sincronização.' };
    }
  } catch (error) {
    console.error('Erro ao iniciar sincronização manual:', error);
    return { success: false, message: 'Erro durante a sincronização.' };
  }
};

// Função para excluir item com suporte ao sistema distribuído
export const deleteForOfflineSync = async (type: TableName, syncId: string): Promise<boolean> => {
  try {
    // Marcar como excluído localmente
    const localData = getLocalStorageData(type);
    const updatedLocalData = localData.filter(item => item.syncId !== syncId);
    localStorage.setItem(type, JSON.stringify(updatedLocalData));
    
    // Se estiver online, excluir no servidor também
    if (navigator.onLine) {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        await supabase
          .from(type)
          .delete()
          .match({ sync_id: syncId });
      }
    }
    
    // Adicionar à fila de sincronização para garantir que seja excluído no servidor quando online
    const syncItem: SyncItem = {
      id: crypto.randomUUID(),
      type,
      data: { syncId },
      timestamp: Date.now(),
      syncId,
      syncVersion: 0,
      _synced: false,
      _deleted: true
    };
    
    await saveToIndexedDB(syncItem);
    
    // Solicitar sincronização quando estiver online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready as ExtendedServiceWorkerRegistration;
      await registration.sync?.register('database-sync');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao marcar item para exclusão:', error);
    return false;
  }
};

// Função para realizar a inicialização do sistema de sincronização
export const initializeSyncSystem = async (): Promise<void> => {
  try {
    // Configurar ouvinte de conexão
    setupOnlineListener();
    
    // Tentar configurar sincronização periódica
    await setupPeriodicSync();
    
    // Sincronizar dados se estiver online
    if (navigator.onLine) {
      await syncWithServer();
    }
    
    console.log('Sistema de sincronização inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar sistema de sincronização:', error);
  }
};
