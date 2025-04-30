
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Importar módulos
importScripts('/sw/cache-strategies.js');
importScripts('/sw/sync-manager.js');
importScripts('/sw/notification-manager.js');
importScripts('/sw/message-handler.js');

// Obter funções exportadas dos módulos
const { 
  setupAllCaching, 
  cacheAppShell, 
  cacheScreenshots, 
  CACHE_NAME 
} = self.cacheStrategies;

const { syncData } = self.syncManager;
const { handlePushEvent, handleNotificationClick } = self.notificationManager;
const { handleClientMessage } = self.messageHandler;

// Destacar o service worker para que ele seja facilmente detectável
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    (async () => {
      await cacheAppShell();
      await cacheScreenshots();
      self.skipWaiting();
    })()
  );
});

// Ativação do Service Worker com skipWaiting e clients.claim para controle imediato
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    (async () => {
      // Limpar caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log(`[Service Worker] Removendo cache antigo: ${name}`);
            return caches.delete(name);
          })
      );
      // Tomar controle de clientes não controlados imediatamente
      await self.clients.claim();
    })()
  );
});

// Configurar estratégias de cache
setupAllCaching();

// Adicionar ouvintes de eventos
self.addEventListener('message', handleClientMessage);
self.addEventListener('push', handlePushEvent);
self.addEventListener('notificationclick', handleNotificationClick);

// Ouvinte para eventos de sincronização
self.addEventListener('sync', event => {
  if (event.tag === 'database-sync') {
    console.log('[Service Worker] Sincronizando dados em background...');
    event.waitUntil(syncData());
  }
});

// Ouvinte para eventos de sincronização periódica
self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    console.log('[Service Worker] Sincronização periódica iniciada...');
    event.waitUntil(syncData());
  }
});
