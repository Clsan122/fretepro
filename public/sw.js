
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Importar módulos
importScripts('/sw/cache-strategies.js');
importScripts('/sw/sync-manager.js');
importScripts('/sw/notification-manager.js');
importScripts('/sw/message-handler.js');
importScripts('/sw/share-handler.js');

// Nome do cache principal
const CACHE = "fretevalor-main-cache";
const offlineFallbackPage = "/offline.html";

// Aguardar até que o workbox esteja carregado
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  // Garantir que todas as importações estejam carregadas
  if (typeof workbox === 'undefined') {
    console.error('[Service Worker] Workbox não carregou!');
    return;
  }

  event.waitUntil(
    (async () => {
      // Cache específico para a página offline
      const cache = await caches.open(CACHE);
      await cache.add(offlineFallbackPage);
      
      // Obter funções exportadas dos módulos
      if (self.cacheStrategies) {
        const { cacheAppShell, cacheScreenshots } = self.cacheStrategies;
        await cacheAppShell();
        await cacheScreenshots();
      }
      
      self.skipWaiting();
    })()
  );
});

// Mensagem para ativar o service worker imediatamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  
  // Enviar para o handler de mensagens
  if (self.messageHandler && self.messageHandler.handleClientMessage) {
    self.messageHandler.handleClientMessage(event);
  }
});

// Ativação do Service Worker com skipWaiting e clients.claim para controle imediato
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  
  // Obter CACHE_NAME do módulo
  const CACHE_NAME = self.cacheStrategies ? self.cacheStrategies.CACHE_NAME : 'fretevalor-v3';
  
  event.waitUntil(
    (async () => {
      // Limpar caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== CACHE)
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
          const cache = await caches.open(CACHE);
          const cachedResponse = await cache.match(offlineFallbackPage);
          return cachedResponse;
        }
      })()
    );
    return;
  }
  
  // Tenta processar compartilhamento, protocolo ou manipuladores de arquivo
  if (self.shareHandler) {
    const { handleShareTarget, handleFileHandler, handleProtocolHandler } = self.shareHandler;
    
    if (handleShareTarget) {
      const shareTargetResponse = handleShareTarget(event);
      if (shareTargetResponse) {
        event.respondWith(shareTargetResponse);
        return;
      }
    }
    
    if (handleFileHandler) {
      const fileHandlerResponse = handleFileHandler(event);
      if (fileHandlerResponse) {
        event.respondWith(fileHandlerResponse);
        return;
      }
    }
    
    if (handleProtocolHandler) {
      const protocolResponse = handleProtocolHandler(event);
      if (protocolResponse) {
        event.respondWith(protocolResponse);
        return;
      }
    }
  }
  
  // Continuar com estratégias de cache normal
  // Isso será gerenciado pelo módulo cache-strategies.js
});

// Configurar estratégias de cache
if (self.cacheStrategies && self.cacheStrategies.setupAllCaching) {
  self.cacheStrategies.setupAllCaching();
}

// Configurar ouvintes para notificações push
if (self.notificationManager) {
  const { handlePushEvent, handleNotificationClick } = self.notificationManager;
  
  if (handlePushEvent) {
    self.addEventListener('push', handlePushEvent);
  }
  
  if (handleNotificationClick) {
    self.addEventListener('notificationclick', handleNotificationClick);
  }
}

// Ouvinte para eventos de sincronização
if (self.syncManager && self.syncManager.syncData) {
  const { syncData } = self.syncManager;
  
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
}
