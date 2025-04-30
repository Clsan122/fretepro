
// Gerenciamento de mensagens entre cliente e service worker

// Processar mensagem do cliente
async function handleClientMessage(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  
  // Solicitação para cachear screenshots
  if (event.data && event.data.type === 'CACHE_SCREENSHOTS') {
    const { urls } = event.data;
    try {
      // Usar a função de cache de screenshots do módulo de cache-strategies
      if (self.cacheStrategies && self.cacheStrategies.cacheScreenshots) {
        const success = await self.cacheStrategies.cacheScreenshots();
        console.log('[Service Worker] Screenshots cacheados via mensagem');
        if (event.source) {
          event.source.postMessage({
            type: 'CACHE_COMPLETE',
            success
          });
        }
      } else {
        // Fallback se a função não estiver disponível
        const cache = await caches.open('fretevalor-v3');
        await cache.addAll(urls);
        console.log('[Service Worker] Screenshots cacheados via fallback');
        if (event.source) {
          event.source.postMessage({
            type: 'CACHE_COMPLETE',
            success: true
          });
        }
      }
    } catch (error) {
      console.error('[Service Worker] Erro ao cachear screenshots:', error);
      if (event.source) {
        event.source.postMessage({
          type: 'CACHE_COMPLETE',
          success: false,
          error: error.message
        });
      }
    }
  }
  
  // Sincronização manual solicitada pelo cliente
  if (event.data && event.data.type === 'SYNC_REQUEST') {
    console.log('[Service Worker] Recebeu solicitação de sincronização manual');
    try {
      if (self.syncManager && self.syncManager.syncData) {
        await self.syncManager.syncData();
        // Responder ao cliente que iniciou a sincronização
        if (event.source) {
          event.source.postMessage({
            type: 'SYNC_RESPONSE',
            success: true,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('[Service Worker] Erro na sincronização manual:', error);
      if (event.source) {
        event.source.postMessage({
          type: 'SYNC_RESPONSE',
          success: false,
          error: error.message
        });
      }
    }
  }
  
  // Status de online/offline
  if (event.data && event.data.type === 'ONLINE_STATUS') {
    const { online } = event.data;
    console.log(`[Service Worker] Status de conexão alterado: ${online ? 'online' : 'offline'}`);
    // Configurar variável global para outros módulos usarem
    self.isOnline = online;
  }
}

// Exportar para uso global
self.messageHandler = {
  handleClientMessage
};
