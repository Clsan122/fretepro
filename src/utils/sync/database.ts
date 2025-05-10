
import { SyncItem, TableName } from "./types";

// Função para abrir conexão com o banco de dados
export const openDatabase = (): Promise<IDBDatabase> => {
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
export const saveToIndexedDB = async (syncItem: SyncItem): Promise<void> => {
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

// Obter itens pendentes de sincronização
export const getPendingSyncItems = async (): Promise<SyncItem[]> => {
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

// Marcar item como sincronizado
export const markItemAsSynced = async (id: string): Promise<void> => {
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

// Obter dados do localStorage com formato padronizado
export const getLocalStorageData = (key: TableName): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erro ao obter dados do localStorage para ${key}:`, error);
    return [];
  }
};
