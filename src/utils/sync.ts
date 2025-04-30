
// Utilitário para lidar com sincronização offline e distribuída

// Type declarations for the service worker sync API
interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

// Estrutura para armazenar dados para sincronização com controle de versão
interface SyncItem {
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
type TableName = "clients" | "drivers" | "freights" | "freight_expenses" | "collection_orders" | "measurements";

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

// Função para sincronização bidirecional
export const syncWithServer = async (): Promise<boolean> => {
  try {
    // Verificar se está online e autenticado
    if (!navigator.onLine) {
      return false;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return false;
    }

    // 1. Primeiro, enviar alterações locais para o servidor
    const pendingItems = await getPendingSyncItems();
    
    for (const item of pendingItems) {
      const { type, data, syncId, syncVersion, _deleted } = item;
      
      try {
        // Se o item foi marcado para exclusão
        if (_deleted) {
          await supabase
            .from(type as TableName)
            .delete()
            .match({ sync_id: syncId });
        } else {
          // Verificar versão atual no servidor
          const { data: remoteData } = await supabase
            .from(type as TableName)
            .select('*')
            .eq('sync_id', syncId)
            .maybeSingle();
          
          // Estratégia de resolução de conflitos - vence a versão mais recente
          if (remoteData && remoteData.sync_version > syncVersion) {
            // Se a versão remota for mais nova, atualizamos o local
            await updateLocalItem(type as TableName, remoteData);
            await markItemAsSynced(item.id);
          } else {
            // Se a versão local for mais nova ou igual, atualizamos o remoto
            await supabase
              .from(type as TableName)
              .upsert({
                ...data,
                sync_id: syncId,
                sync_version: syncVersion
              });
            await markItemAsSynced(item.id);
          }
        }
      } catch (error) {
        console.error(`Erro na sincronização do item ${syncId}:`, error);
      }
    }
    
    // 2. Puxar dados novos do servidor
    await pullNewDataFromServer();
    
    return true;
  } catch (error) {
    console.error('Erro na sincronização bidirecional:', error);
    return false;
  }
};

// Função auxiliar para atualizar item local
const updateLocalItem = async (type: TableName, remoteData: any): Promise<void> => {
  // Atualizar no IndexedDB
  const db = await openDatabase();
  const transaction = db.transaction('pendingSync', 'readwrite');
  const store = transaction.objectStore('pendingSync');
  
  const index = store.index('syncId');
  const request = index.get(remoteData.sync_id);
  
  request.onsuccess = () => {
    const item = request.result;
    if (item) {
      item.data = remoteData;
      item.syncVersion = remoteData.sync_version || 1; // Garantir que sync_version existe
      item._synced = true;
      store.put(item);
    }
  };
  
  // Atualizar no localStorage
  const localData = getLocalStorageData(type);
  const updatedLocalData = localData.map(item => 
    item.syncId === remoteData.sync_id ? {...remoteData, _synced: true} : item
  );
  localStorage.setItem(type, JSON.stringify(updatedLocalData));
};

// Função para marcar item como sincronizado
const markItemAsSynced = async (id: string): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction('pendingSync', 'readwrite');
  const store = transaction.objectStore('pendingSync');
  
  const request = store.get(id);
  
  request.onsuccess = () => {
    const item = request.result;
    if (item) {
      item._synced = true;
      store.put(item);
    }
  };
};

// Função para puxar novos dados do servidor
const pullNewDataFromServer = async (): Promise<void> => {
  // Obter últimos timestamps de cada tipo de dados
  const tables: TableName[] = ['clients', 'drivers', 'freights', 'freight_expenses', 'collection_orders', 'measurements'];
  
  for (const table of tables) {
    try {
      // Obter último timestamp local
      const lastSyncTimestamp = getLastSyncTimestamp(table);
      
      // Buscar dados mais recentes do servidor
      const { data: remoteData, error } = await supabase
        .from(table)
        .select('*')
        .gt('updated_at', lastSyncTimestamp);
      
      if (error) {
        console.error(`Erro ao buscar dados da tabela ${table}:`, error);
        continue;
      }
      
      if (remoteData && remoteData.length > 0) {
        // Atualizar dados locais
        for (const item of remoteData) {
          await saveLocalData(table, item);
        }
        
        // Atualizar timestamp da última sincronização
        setLastSyncTimestamp(table, new Date().toISOString());
      }
    } catch (error) {
      console.error(`Erro ao sincronizar tabela ${table}:`, error);
    }
  }
};

// Função para salvar dados localmente
const saveLocalData = async (type: TableName, data: any): Promise<void> => {
  // Converter formato do servidor para formato local
  const localItem = {
    ...data,
    syncId: data.sync_id,
    syncVersion: data.sync_version || 1, // Garantir que sync_version existe
    _synced: true
  };
  
  // Salvar no localStorage
  const localData = getLocalStorageData(type);
  
  // Verificar se já existe e atualizar
  const existingIndex = localData.findIndex(item => item.syncId === data.sync_id);
  if (existingIndex >= 0) {
    // Se a versão local for mais nova, não sobrescrever
    const localVersion = localData[existingIndex].syncVersion || 0;
    const remoteVersion = data.sync_version || 0;
    
    if (localVersion > remoteVersion) {
      return;
    }
    localData[existingIndex] = localItem;
  } else {
    localData.push(localItem);
  }
  
  localStorage.setItem(type, JSON.stringify(localData));
  
  // Salvar no IndexedDB também
  const syncItem: SyncItem = {
    id: crypto.randomUUID(),
    type,
    data: localItem,
    timestamp: Date.now(),
    syncId: data.sync_id,
    syncVersion: data.sync_version || 1,
    _synced: true
  };
  
  await saveToIndexedDB(syncItem);
};

// Obter o timestamp da última sincronização
const getLastSyncTimestamp = (type: TableName): string => {
  const timestamp = localStorage.getItem(`last_sync_${type}`);
  if (timestamp) {
    return timestamp;
  }
  // Retornar data antiga para sincronizar todo o histórico na primeira vez
  return '2000-01-01T00:00:00.000Z';
};

// Salvar o timestamp da última sincronização
const setLastSyncTimestamp = (type: TableName, timestamp: string): void => {
  localStorage.setItem(`last_sync_${type}`, timestamp);
};

// Função para abrir conexão com o banco de dados
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fretepro-offline-db', 2);
    
    request.onerror = () => {
      console.error('Erro ao abrir o banco de dados:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Verificar se os stores já existem
      if (!db.objectStoreNames.contains('pendingSync')) {
        const store = db.createObjectStore('pendingSync', { keyPath: 'id' });
        // Criar índices para buscas eficientes
        store.createIndex('syncId', 'syncId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Função para salvar no IndexedDB com suporte a sistema distribuído
const saveToIndexedDB = async (syncItem: SyncItem): Promise<void> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction('pendingSync', 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      const request = store.add(syncItem);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    } catch (error) {
      console.error('Erro ao salvar no IndexedDB:', error);
      reject(error);
    }
  });
};

// Obter dados do localStorage com formato padronizado
const getLocalStorageData = (key: TableName): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erro ao obter dados do localStorage para ${key}:`, error);
    return [];
  }
};

// Obter itens pendentes de sincronização
const getPendingSyncItems = async (): Promise<SyncItem[]> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pendingSync', 'readonly');
    const store = transaction.objectStore('pendingSync');
    
    const items: SyncItem[] = [];
    
    // Filtrar apenas os não sincronizados
    const index = store.index('timestamp');
    const cursorRequest = index.openCursor();
    
    cursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const item = cursor.value as SyncItem;
        if (!item._synced) {
          items.push(item);
        }
        cursor.continue();
      } else {
        resolve(items);
      }
    };
    
    cursorRequest.onerror = () => {
      reject(cursorRequest.error);
    };
  });
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

// Configurar sincronização periódica
export const setupPeriodicSync = async (intervalMinutes: number = 15): Promise<boolean> => {
  try {
    // Verificar suporte a sincronização periódica
    if (!('serviceWorker' in navigator) || !('PeriodicSyncManager' in window)) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready as any;
    
    // Verificar permissão
    if (registration.periodicSync) {
      try {
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName
        });
        
        if (status.state === 'granted') {
          // Registrar sincronização periódica
          await registration.periodicSync.register('periodic-sync', {
            minInterval: intervalMinutes * 60 * 1000 // converter minutos para ms
          });
          return true;
        }
      } catch (error) {
        console.error('Erro ao verificar permissão para sincronização periódica:', error);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao configurar sincronização periódica:', error);
    return false;
  }
};

// Iniciar ouvinte de conexão para sincronizar quando ficar online
export const setupOnlineListener = (): void => {
  window.addEventListener('online', async () => {
    console.log('Conexão online detectada. Iniciando sincronização...');
    await syncWithServer();
  });
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
