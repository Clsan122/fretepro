
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Nome do cache
workbox.core.setCacheNameDetails({
  prefix: 'fretepro',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

// Precache manifestos e assets estáticos
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.webmanifest', revision: '1' },
  { url: '/src/assets/favicon.svg', revision: '1' },
  { url: '/icons/icon-192.png', revision: '1' },
  { url: '/icons/icon-512.png', revision: '1' },
  { url: '/src/index.css', revision: '1' }
]);

// Cache para imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'fretepro-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
);

// Cache para fontes
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fretepro-fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
      })
    ]
  })
);

// Cache para API e dados dinâmicos
registerRoute(
  ({ request }) => request.destination === 'script' || 
                   request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'fretepro-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 24 horas
      })
    ]
  })
);

// Cache para páginas HTML com Network First
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'fretepro-pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Fallback para página offline
workbox.routing.setCatchHandler(({ event }) => {
  if (!event.request || !event.request.destination) {
    return Response.error();
  }
  
  switch (event.request.destination) {
    case 'document':
      return caches.match('/index.html')
        .then(response => response || new Response('Você está offline.', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }));
    case 'image':
      return caches.match('/icons/icon-192.png')
        .then(response => response || new Response('', {
          status: 200,
          headers: { 'Content-Type': 'image/png' }
        }));
    default:
      return Response.error();
  }
});

// Funcionalidade de Background Sync para sistema distribuído
// ------------------------------------

// Constantes
const DB_NAME = 'fretepro-offline-db';
const STORE_NAME = 'pendingSync';
const API_ENDPOINT = 'https://xitctqydapolbooqnrul.supabase.co';

// Abrir ou criar o IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
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
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME');
  
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

// Remover dados sincronizados com sucesso
async function removeSyncedData(ids) {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  for (const id of ids) {
    store.delete(id);
  }
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Função para sincronizar dados com o servidor
async function pushLocalDataToDatabase() {
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
      
      // Preparar cabeçalhos
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Realizar operação de sincronização
      if (_deleted) {
        // Se item está marcado para exclusão
        await fetch(`${API_ENDPOINT}/rest/v1/${type}?sync_id=eq.${syncId}`, {
          method: 'DELETE',
          headers
        });
      } else {
        // Verificar versão atual no servidor
        const response = await fetch(`${API_ENDPOINT}/rest/v1/${type}?sync_id=eq.${syncId}`, {
          method: 'GET',
          headers
        });
        
        const serverData = await response.json();
        
        // Estratégia de resolução de conflitos
        if (serverData && serverData.length > 0 && serverData[0].sync_version > data.syncVersion) {
          // Servidor tem versão mais recente, manter como não sincronizado
          // Em uma sincronização posterior, a aplicação resolverá o conflito
        } else {
          // Local tem versão mais recente ou igual, atualizar no servidor
          await fetch(`${API_ENDPOINT}/rest/v1/${type}`, {
            method: 'POST',
            headers: {
              ...headers,
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              ...data,
              sync_id: syncId,
              sync_version: data.syncVersion
            })
          });
          
          // Marcar como sincronizado
          syncedIds.push(item.id);
        }
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
  
  return Promise.resolve();
}

// Função para buscar e sincronizar dados do servidor
async function pullServerData() {
  try {
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
      return;
    }
    
    if (!token) {
      return; // Não pode sincronizar sem autenticação
    }
    
    // Tabelas para sincronização
    const tables = ['clients', 'drivers', 'freights', 'freight_expenses', 'collection_orders', 'measurements'];
    
    for (const table of tables) {
      // Obter último timestamp do IndexedDB
      const lastTimestamp = await getLastSyncTimestamp(table);
      
      // Buscar dados mais recentes
      const response = await fetch(`${API_ENDPOINT}/rest/v1/${table}?updated_at=gt.${lastTimestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const serverData = await response.json();
        
        // Salvar dados recebidos no IndexedDB para acesso offline
        for (const item of serverData) {
          await saveToIndexedDB(table, item);
        }
        
        // Atualizar timestamp da última sincronização
        if (serverData.length > 0) {
          const maxTimestamp = serverData.reduce((max, item) => {
            return new Date(item.updated_at) > new Date(max) ? item.updated_at : max;
          }, lastTimestamp);
          
          await setLastSyncTimestamp(table, maxTimestamp);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar dados do servidor:', error);
  }
}

// Salvar dados no IndexedDB para acesso offline
async function saveToIndexedDB(type, serverData) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const syncItem = {
      id: crypto.randomUUID(),
      type,
      data: {
        ...serverData,
        syncId: serverData.sync_id,
        syncVersion: serverData.sync_version
      },
      timestamp: Date.now(),
      syncId: serverData.sync_id,
      syncVersion: serverData.sync_version,
      _synced: true
    };
    
    const request = store.add(syncItem);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Obter último timestamp de sincronização
async function getLastSyncTimestamp(type) {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('type');
    
    const request = index.openCursor(IDBKeyRange.only(type), 'prev');
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        resolve(cursor.value.timestamp);
      } else {
        // Se não houver registro, retornar data antiga
        resolve('2000-01-01T00:00:00.000Z');
      }
    };
    
    request.onerror = () => {
      resolve('2000-01-01T00:00:00.000Z');
    };
  });
}

// Salvar último timestamp de sincronização
async function setLastSyncTimestamp(type, timestamp) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Salvar timestamp como metadado
    const syncItem = {
      id: `${type}_lastSync`,
      type: `${type}_meta`,
      timestamp,
      syncId: `${type}_lastSync`,
      syncVersion: 0,
      _synced: true,
      data: { timestamp }
    };
    
    const getRequest = store.get(syncItem.id);
    
    getRequest.onsuccess = () => {
      if (getRequest.result) {
        // Atualizar registro existente
        syncItem.id = getRequest.result.id;
        store.put(syncItem);
      } else {
        // Criar novo registro
        store.add(syncItem);
      }
      resolve();
    };
    
    getRequest.onerror = () => {
      // Se falhar a consulta, tentar adicionar
      const addRequest = store.add(syncItem);
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    };
  });
}

// Função principal de sincronização bidirecional
async function syncBidirectional() {
  try {
    // 1. Enviar alterações locais para o servidor
    await pushLocalDataToDatabase();
    
    // 2. Buscar alterações do servidor
    await pullServerData();
    
    // 3. Notificar clientes que a sincronização foi concluída
    if (self.clients) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          timestamp: new Date().toISOString()
        });
      });
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Erro na sincronização bidirecional:', error);
    return Promise.reject(error);
  }
}

// Ouvinte para eventos de sincronização
self.addEventListener('sync', event => {
  if (event.tag === 'database-sync') {
    event.waitUntil(syncBidirectional());
  }
});

// Ouvinte para eventos de sincronização periódica
self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(syncBidirectional());
  }
});

// Skip waiting e clients claim
self.skipWaiting();
workbox.core.clientsClaim();
