
// Service Worker principal para FreteValor PWA
// Importa o Workbox para estratégias de cache avançadas
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Verificar se o Workbox foi carregado corretamente
if (!workbox) {
  console.error('Workbox falhou ao carregar!');
} else {
  console.log('Workbox carregado com sucesso!');
  
  // Ativar o modo de debug em desenvolvimento
  workbox.setConfig({ debug: false });
}

// Importar módulos
importScripts('/sw/cache-strategies.js');
importScripts('/sw/sync-manager.js');
importScripts('/sw/notification-manager.js');
importScripts('/sw/message-handler.js');
importScripts('/sw/share-handler.js');

// Nome do cache principal
const CACHE = "fretevalor-main-cache-v5";
const offlineFallbackPage = "/offline.html";

// Lista de imagens PWA críticas para carregar imediatamente
const CRITICAL_PWA_IMAGES = [
  '/icons/fretevalor-logo.png',
  '/android/android-launchericon-192-192.png',
  '/ios/180.png',
  '/screenshots/landing-page.png'
];

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
      try {
        // Cache específico para a página offline
        const cache = await caches.open(CACHE);
        await cache.add(offlineFallbackPage);
        
        // Obter funções exportadas dos módulos
        if (self.cacheStrategies) {
          const { 
            cacheAppShell, 
            cacheIcons, 
            cacheScreenshots,
            cacheUrls,
            verifyManifestImagesCached
          } = self.cacheStrategies;
          
          // Armazenar recursos críticos em cache
          await cacheAppShell();
          await cacheUrls(CRITICAL_PWA_IMAGES, `${CACHE}-critical-images`);
          
          // Iniciar cache de recursos não-críticos
          Promise.all([
            cacheIcons(),
            cacheScreenshots(),
            verifyManifestImagesCached()
          ]).then(results => {
            console.log('[Service Worker] Cache de recursos concluído:', results);
          }).catch(error => {
            console.error('[Service Worker] Erro ao armazenar recursos em cache:', error);
          });
        }

        // Imediatamente tomar controle
        self.skipWaiting();
        console.log('[Service Worker] Instalado e pronto para uso');
      } catch (error) {
        console.error('[Service Worker] Erro durante a instalação:', error);
      }
    })()
  );
});

// Mensagem para ativar o service worker imediatamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  
  // Gerenciar solicitação para armazenar screenshots em cache
  if (event.data && event.data.type === "CACHE_SCREENSHOTS" && event.data.urls) {
    if (self.cacheStrategies && self.cacheStrategies.cacheUrls) {
      self.cacheStrategies.cacheUrls(event.data.urls, `${CACHE}-screenshots`)
        .then(success => {
          // Notificar cliente sobre o status
          if (event.source && event.source.postMessage) {
            event.source.postMessage({
              type: 'CACHE_COMPLETE',
              success: success
            });
          }
        });
    }
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
  const CACHE_NAME = self.cacheStrategies ? self.cacheStrategies.CACHE_NAME : 'fretevalor-v5';
  
  event.waitUntil(
    (async () => {
      // Limpar caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => {
            // Manter apenas o cache atual e o cache principal
            return !name.includes(CACHE_NAME) && !name.includes(CACHE);
          })
          .map(name => {
            console.log(`[Service Worker] Removendo cache antigo: ${name}`);
            return caches.delete(name);
          })
      );
      
      // Verificar o manifesto e atualizar o cache das imagens se necessário
      if (self.cacheStrategies && self.cacheStrategies.verifyManifestImagesCached) {
        self.cacheStrategies.verifyManifestImagesCached()
          .then(success => {
            console.log(`[Service Worker] Verificação do manifesto: ${success ? 'OK' : 'Falha'}`);
          });
      }
      
      // Tomar controle de clientes não controlados imediatamente
      await self.clients.claim();
      console.log('[Service Worker] Agora controlando todas as guias');
    })()
  );
});

// Ativar preload de navegação se suportado
if (workbox && workbox.navigationPreload) {
  workbox.navigationPreload.enable();
}

// Melhorar a sincronização de dados quando o navegador ficar online
self.addEventListener('online', () => {
  console.log('[Service Worker] Dispositivo ficou online. Iniciando sincronização...');
  
  if (self.syncManager && self.syncManager.syncData) {
    self.syncManager.syncData()
      .then((result) => {
        console.log('[Service Worker] Sincronização automática concluída:', result);
        
        // Notificar clientes sobre o status
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SYNC_COMPLETED',
              timestamp: new Date().toISOString()
            });
          });
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Erro na sincronização automática:', error);
      });
  }
});

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
  
  // Verificar se é uma solicitação de imagem do manifesto
  const url = new URL(event.request.url);
  if (
    (url.pathname.startsWith('/icons/') || 
     url.pathname.startsWith('/android/') || 
     url.pathname.startsWith('/ios/') || 
     url.pathname.startsWith('/screenshots/')) &&
    event.request.destination === 'image'
  ) {
    event.respondWith(
      (async () => {
        // Primeiro verifica o cache
        const cacheResponse = await caches.match(event.request);
        if (cacheResponse) {
          return cacheResponse;
        }
        
        try {
          // Tenta buscar da rede
          const networkResponse = await fetch(event.request, {
            // Permite imagens CORS, importante para recursos hospedados externamente
            mode: 'no-cors'
          });
          
          // Armazenar em cache para uso futuro
          const cache = await caches.open(`${CACHE}-manifest-images`);
          cache.put(event.request, networkResponse.clone());
          
          return networkResponse;
        } catch (error) {
          console.error('[Service Worker] Erro ao buscar imagem do manifesto:', error);
          // Retorna uma resposta vazia se não conseguir carregar a imagem
          return new Response(null, {status: 404});
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
  
  // Adicionar suporte a API para Supabase - não cachear requisições para a API
  if (url.hostname.includes('supabase') || url.pathname.includes('/rest/') || url.pathname.includes('/auth/')) {
    return; // Deixa o Supabase lidar com a requisição normalmente
  }
  
  // Continuar com estratégias de cache normal gerenciado pelo Workbox
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

// Adicionar manipulador para logout - limpar caches sensíveis
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'USER_LOGOUT') {
    // Limpar cache que pode conter dados sensíveis do usuário
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        if (cacheName.includes('-user-') || cacheName.includes('-private-')) {
          caches.delete(cacheName);
          console.log(`[Service Worker] Cache removido após logout: ${cacheName}`);
        }
      });
    });
  }
});
