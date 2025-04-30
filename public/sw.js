
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Importar módulos
importScripts('/sw/cache-strategies.js');
importScripts('/sw/sync-manager.js');
importScripts('/sw/notification-manager.js');
importScripts('/sw/message-handler.js');
importScripts('/sw/share-handler.js');

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
const { handleShareTarget, handleFileHandler, handleProtocolHandler } = self.shareHandler;

// Nome do cache para a página offline
const OFFLINE_CACHE = "fretevalor-offline-page";
const offlineFallbackPage = "/offline.html";

// Destacar o service worker para que ele seja facilmente detectável
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    (async () => {
      // Cache geral do app shell
      await cacheAppShell();
      await cacheScreenshots();
      
      // Cache específico para a página offline
      const offlineCache = await caches.open(OFFLINE_CACHE);
      await offlineCache.add(offlineFallbackPage);
      
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
          .filter(name => name !== CACHE_NAME && name !== OFFLINE_CACHE)
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

// Ativar preload de navegação se suportado
if (workbox.navigationPreload) {
  workbox.navigationPreload.enable();
}

// Manipulador de fetch para interceptar e processar solicitações
self.addEventListener('fetch', (event) => {
  // Para requisições de navegação (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Primeiro, tenta usar a resposta de preload
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          
          // Caso não haja preload, tenta a rede
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Se falhar por estar offline, use a página offline
          console.log('[Service Worker] Falha ao buscar. Retornando página offline.');
          const cache = await caches.open(OFFLINE_CACHE);
          const cachedResponse = await cache.match(offlineFallbackPage);
          return cachedResponse;
        }
      })()
    );
    return;
  }
  
  // Tenta processar compartilhamento, protocolo ou manipuladores de arquivo
  const shareTargetResponse = handleShareTarget(event);
  if (shareTargetResponse) {
    event.respondWith(shareTargetResponse);
    return;
  }
  
  const fileHandlerResponse = handleFileHandler(event);
  if (fileHandlerResponse) {
    event.respondWith(fileHandlerResponse);
    return;
  }
  
  const protocolResponse = handleProtocolHandler(event);
  if (protocolResponse) {
    event.respondWith(protocolResponse);
    return;
  }
  
  // Continuar com estratégias de cache normal se não for um compartilhamento
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
