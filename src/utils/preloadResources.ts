
// Pré-carregar screenshots para uso offline
export function preloadScreenshots(screenshotUrls: string[]): void {
  if (navigator.onLine) {
    screenshotUrls.forEach(url => {
      try {
        const preloadImage = new Image();
        preloadImage.src = url;
        console.log(`Pré-carregando ${url}`);
      } catch (err) {
        console.error(`Erro ao pré-carregar ${url}:`, err);
      }
    });
  }
}

// Solicitar cache de screenshots via Service Worker
export function requestScreenshotsCache(screenshotUrls: string[]): void {
  if (navigator.onLine && navigator.serviceWorker.controller) {
    try {
      // Informar o service worker para adicionar screenshots ao cache
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_SCREENSHOTS',
        urls: screenshotUrls
      });
      
      console.log('Solicitação para cache de screenshots enviada');
    } catch (err) {
      console.error('Erro ao solicitar cache de screenshots:', err);
    }
  }
}
