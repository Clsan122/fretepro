
// Utilitário para lidar com sincronização offline

// Salvar dados para sincronização posterior
export const saveForOfflineSync = async (type: string, data: any): Promise<boolean> => {
  try {
    // Se estiver online, tente enviar imediatamente
    if (navigator.onLine) {
      try {
        // Implementar aqui a lógica para salvar diretamente
        // Exemplo: salvar no localStorage para o tipo específico
        const existingData = getLocalStorageData(type);
        existingData.push({...data, _synced: true});
        localStorage.setItem(type, JSON.stringify(existingData));
        return true;
      } catch (error) {
        console.error('Erro ao salvar dados online:', error);
      }
    }
    
    // Se offline ou falhou ao enviar, use o IndexedDB e background sync
    await saveToIndexedDB(type, data);
    
    // Solicitar sincronização quando estiver online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('database-sync');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados para sincronização offline:', error);
    return false;
  }
};

// Função para salvar no IndexedDB
const saveToIndexedDB = async (type: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fretepro-offline-db', 1);
    
    request.onerror = () => {
      console.error('Erro ao abrir o banco de dados:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      try {
        const db = request.result;
        const transaction = db.transaction('pendingSync', 'readwrite');
        const store = transaction.objectStore('pendingSync');
        
        const syncItem = {
          type,
          data,
          timestamp: Date.now(),
          _synced: false
        };
        
        store.add(syncItem);
        
        transaction.oncomplete = () => {
          resolve();
        };
        
        transaction.onerror = () => {
          reject(transaction.error);
        };
      } catch (error) {
        console.error('Erro ao salvar no IndexedDB:', error);
        reject(error);
      }
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// Função para obter dados do localStorage
const getLocalStorageData = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erro ao obter dados do localStorage para ${key}:`, error);
    return [];
  }
};

// Verificar status de sincronização
export const checkSyncStatus = async (): Promise<{ pending: number }> => {
  try {
    if (!('indexedDB' in window)) {
      return { pending: 0 };
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('fretepro-offline-db', 1);
      
      request.onerror = () => {
        console.error('Erro ao verificar status de sincronização:', request.error);
        resolve({ pending: 0 });
      };
      
      request.onsuccess = () => {
        try {
          const db = request.result;
          if (!db.objectStoreNames.contains('pendingSync')) {
            resolve({ pending: 0 });
            return;
          }
          
          const transaction = db.transaction('pendingSync', 'readonly');
          const store = transaction.objectStore('pendingSync');
          const countRequest = store.count();
          
          countRequest.onsuccess = () => {
            resolve({ pending: countRequest.result });
          };
          
          countRequest.onerror = () => {
            console.error('Erro ao contar itens pendentes:', countRequest.error);
            resolve({ pending: 0 });
          };
        } catch (error) {
          console.error('Erro ao verificar status de sincronização:', error);
          resolve({ pending: 0 });
        }
      };
    });
  } catch (error) {
    console.error('Erro ao verificar status de sincronização:', error);
    return { pending: 0 };
  }
};
