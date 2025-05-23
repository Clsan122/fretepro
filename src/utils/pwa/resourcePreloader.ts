
// Lista de screenshots para pré-carregar no cache
const screenshotUrls = [
  '/screenshots/landing-page.png',
  '/screenshots/dashboard-relatorios.png',
  '/screenshots/novo-cliente.png',
  '/screenshots/ordem-coleta-detalhes.png',
  '/screenshots/novo-frete.png',
  '/screenshots/cadastro-motorista.png'
];

export function preloadScreenshots(): void {
  if (!navigator.onLine) return;

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

export function requestScreenshotCache(): void {
  if (navigator.onLine && navigator.serviceWorker.controller) {
    try {
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

export function setupResourcePreloading(): void {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloadScreenshots();
    }, 2000); // Atrasar o pré-carregamento para não competir com recursos críticos
  });
}
