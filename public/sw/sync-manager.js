
// Gerenciamento de sincronização em segundo plano

// Função para abrir ou criar o IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fretevalor-offline-db', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSync')) {
        const store = db.createObjectStore('pendingSync', { keyPath: 'id' });
        store.createIndex('syncId', 'syncId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Obter todos os dados pendentes de sincronização
async function getPendingSyncData() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pendingSync', 'readonly');
    const store = transaction.objectStore('pendingSync');
    
    // Obter apenas itens não sincronizados
    const items = [];
    
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (!cursor.value._synced) {
          items.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(items);
      }
    };
    
    transaction.onerror = () => reject(transaction.error);
  });
}

// Marcar dados como sincronizados
async function markAsSynced(ids) {
  const db = await openDatabase();
  const transaction = db.transaction('pendingSync', 'readwrite');
  const store = transaction.objectStore('pendingSync');
  
  for (const id of ids) {
    const request = store.get(id);
    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item._synced = true;
        store.put(item);
      }
    };
  }
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Função principal de sincronização
async function syncData() {
  try {
    const pendingData = await getPendingSyncData();
    if (!pendingData || pendingData.length === 0) {
      return Promise.resolve(); // Nada para sincronizar
    }
    
    // IDs dos dados que foram sincronizados com sucesso
    const syncedIds = [];
    
    for (const item of pendingData) {
      try {
        const { type, data, syncId, _deleted } = item;
        
        // Obter token de autenticação da cache
        let token = null;
        try {
          const cacheResponse = await caches.match('/auth/token');
          if (cacheResponse) {
            const tokenData = await cacheResponse.json();
            token = tokenData.access_token;
          }
        } catch (error) {
          console.error('Erro ao obter token de autenticação:', error);
        }
        
        if (token) {
          const API_ENDPOINT = 'https://xitctqydapolbooqnrul.supabase.co';
          
          // Realizar operação de sincronização baseada no status do item
          if (_deleted) {
            // Tentar excluir item do servidor
            await fetch(`${API_ENDPOINT}/rest/v1/${type}?sync_id=eq.${syncId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            // Marcar como sincronizado
            syncedIds.push(item.id);
          } else {
            // Tentar salvar/atualizar item no servidor
            await fetch(`${API_ENDPOINT}/rest/v1/${type}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify({
                ...data,
                sync_id: syncId,
                sync_version: data.syncVersion || 1
              })
            });
            
            // Marcar como sincronizado
            syncedIds.push(item.id);
          }
        } else {
          // Mesmo sem token, marcamos os dados como "vistos"
          // para evitar processamento repetido
          syncedIds.push(item.id);
        }
      } catch (error) {
        console.error('Erro sincronizando item:', error);
        // Continuar com o próximo item mesmo se houver erro
      }
    }
    
    // Marcar dados como sincronizados
    if (syncedIds.length > 0) {
      await markAsSynced(syncedIds);
    }
    
    // Notificar clientes que a sincronização foi concluída
    if (self.clients) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          timestamp: new Date().toISOString()
        });
      });
    }
    
    // Transferir dados para o cache para acesso entre navegadores
    await updateBrowserCache();
    
    return true;
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return false;
  }
}

// Nova função para manter dados no cache para acesso entre navegadores
async function updateBrowserCache() {
  try {
    const db = await openDatabase();
    const transaction = db.transaction('pendingSync', 'readonly');
    const store = transaction.objectStore('pendingSync');
    
    // Agrupar dados por tipo
    const dataByType = {};
    
    return new Promise((resolve, reject) => {
      store.openCursor().onsuccess = async (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = cursor.value;
          
          // Ignorar itens marcados para exclusão
          if (!item._deleted) {
            // Inicializar array se não existir
            if (!dataByType[item.type]) {
              dataByType[item.type] = [];
            }
            
            // Adicionar item ao array do tipo correspondente
            dataByType[item.type].push(item.data);
          }
          
          cursor.continue();
        } else {
          // Armazenar cada tipo de dados em seu próprio cache
          try {
            const cache = await caches.open('app-data-cache-v1');
            
            // Para cada tipo de dados, criar uma resposta e armazenar no cache
            for (const type in dataByType) {
              const response = new Response(JSON.stringify(dataByType[type]), {
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'max-age=86400'
                }
              });
              
              await cache.put(`/api/cached-data/${type}`, response);
            }
            
            console.log('Dados armazenados no cache para acesso entre navegadores');
            resolve();
          } catch (error) {
            console.error('Erro ao armazenar dados no cache:', error);
            resolve(); // Resolver mesmo com erro para não bloquear o processo
          }
        }
      };
      
      transaction.onerror = () => {
        console.error('Erro ao ler dados para cache:', transaction.error);
        resolve(); // Resolver mesmo com erro
      };
    });
  } catch (error) {
    console.error('Erro ao atualizar cache:', error);
  }
}

// Adicionar ouvinte para armazenar dados no cache quando a aplicação é fechada
self.addEventListener('appgoingaway', async () => {
  await updateBrowserCache();
});

// Exportar funções para uso global
self.syncManager = {
  openDatabase,
  syncData,
  getPendingSyncData,
  markAsSynced,
  updateBrowserCache
};
