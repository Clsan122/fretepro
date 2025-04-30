
// Gerenciamento de mensagens entre cliente e service worker
import { cacheScreenshots } from './cache-strategies.js';
import { syncData } from './sync-manager.js';

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
      const cache = await caches.open('fretevalor-v2');
      await cache.addAll(urls);
      console.log('[Service Worker] Screenshots cacheados via mensagem');
      if (event.source) {
        event.source.postMessage({
          type: 'CACHE_COMPLETE',
          success: true
        });
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
      await syncData();
      // Responder ao cliente que iniciou a sincronização
      if (event.source) {
        event.source.postMessage({
          type: 'SYNC_RESPONSE',
          success: true,
          timestamp: new Date().toISOString()
        });
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
}

export {
  handleClientMessage
};
