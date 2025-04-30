
// Estratégias de cache para diferentes tipos de recursos

// Nome do cache principal
const CACHE_NAME = 'fretevalor-v3';

// Lista de arquivos essenciais para o app shell
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/assets/favicon.svg',
  '/android/android-launchericon-192-192.png',
  '/android/android-launchericon-512-512.png',
  '/icons/fretevalor-logo.png',
  '/manifest.webmanifest'
];

// Lista de screenshots para garantir que sejam cacheadas
const SCREENSHOTS = [
  '/screenshots/landing-page.png',
  '/screenshots/dashboard-relatorios.png',
  '/screenshots/novo-cliente.png',
  '/screenshots/ordem-coleta-detalhes.png',
  '/screenshots/novo-frete.png',
  '/screenshots/cadastro-motorista.png'
];

// Configuração do Workbox
function setupWorkboxConfig() {
  workbox.core.setCacheNameDetails({
    prefix: 'fretevalor',
    suffix: 'v3',
    precache: 'precache',
    runtime: 'runtime'
  });
}

// Precache manifestos e assets estáticos
function setupPrecaching() {
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '3' },
    { url: '/index.html', revision: '3' },
    { url: '/manifest.webmanifest', revision: '3' },
    { url: '/icons/fretevalor-logo.png', revision: '1' },
    { url: '/android/android-launchericon-192-192.png', revision: '1' },
    { url: '/android/android-launchericon-512-512.png', revision: '1' },
    { url: '/android/android-launchericon-144-144.png', revision: '1' },
    { url: '/android/android-launchericon-96-96.png', revision: '1' },
    { url: '/android/android-launchericon-72-72.png', revision: '1' },
    { url: '/android/android-launchericon-48-48.png', revision: '1' },
    { url: '/screenshots/landing-page.png', revision: '2' },
    { url: '/screenshots/dashboard-relatorios.png', revision: '2' },
    { url: '/screenshots/novo-cliente.png', revision: '2' },
    { url: '/screenshots/ordem-coleta-detalhes.png', revision: '2' },
    { url: '/screenshots/novo-frete.png', revision: '2' },
    { url: '/screenshots/cadastro-motorista.png', revision: '2' }
  ]);
}

// Configurar caching específico para screenshots
function setupScreenshotsCaching() {
  const { registerRoute } = workbox.routing;
  const { CacheFirst } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;
  
  registerRoute(
    ({ url }) => SCREENSHOTS.some(screenshot => url.pathname.includes(screenshot)),
    new CacheFirst({
      cacheName: 'fretevalor-screenshots',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
        })
      ]
    })
  );
}

// Configurar caching de imagens
function setupImageCaching() {
  const { registerRoute } = workbox.routing;
  const { CacheFirst } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;
  
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'fretevalor-images',
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
}

// Configurar caching de fontes
function setupFontCaching() {
  const { registerRoute } = workbox.routing;
  const { CacheFirst } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;
  
  registerRoute(
    ({ request }) => request.destination === 'font',
    new CacheFirst({
      cacheName: 'fretevalor-fonts',
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
}

// Configurar caching de scripts e styles
function setupResourceCaching() {
  const { registerRoute } = workbox.routing;
  const { StaleWhileRevalidate } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  const { ExpirationPlugin } = workbox.expiration;
  
  registerRoute(
    ({ request }) => request.destination === 'script' || 
                     request.destination === 'style',
    new StaleWhileRevalidate({
      cacheName: 'fretevalor-resources',
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
}

// Configurar caching de páginas HTML
function setupPagesCaching() {
  const { registerRoute } = workbox.routing;
  const { NetworkFirst } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
      cacheName: 'fretevalor-pages',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
}

// Inicializar o app shell no cache
async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  console.log('[Service Worker] Cacheando app shell');
  return cache.addAll(APP_SHELL_FILES);
}

// Cachear screenshots
async function cacheScreenshots() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll(SCREENSHOTS);
    console.log('[Service Worker] Screenshots cacheados com sucesso');
    return true;
  } catch (err) {
    console.error('[Service Worker] Erro ao cachear screenshots:', err);
    return false;
  }
}

// Configurar todas as estratégias de cache
function setupAllCaching() {
  setupWorkboxConfig();
  setupPrecaching();
  setupScreenshotsCaching();
  setupImageCaching();
  setupFontCaching();
  setupResourceCaching();
  setupPagesCaching();
}

// Exportação para o escopo global em vez de usar export/import ES6
// que não é suportado em todos os service workers
self.cacheStrategies = {
  CACHE_NAME,
  APP_SHELL_FILES,
  SCREENSHOTS,
  setupAllCaching,
  cacheAppShell,
  cacheScreenshots
};
