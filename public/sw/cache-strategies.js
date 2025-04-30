
// Estratégias de cache para diferentes tipos de recursos

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Nome do cache principal
const CACHE_NAME = 'fretevalor-v2';

// Lista de arquivos essenciais para o app shell
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/assets/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/manifest.webmanifest'
];

// Configuração do Workbox
function setupWorkboxConfig() {
  workbox.core.setCacheNameDetails({
    prefix: 'fretevalor',
    suffix: 'v2',
    precache: 'precache',
    runtime: 'runtime'
  });
}

// Precache manifestos e assets estáticos
function setupPrecaching() {
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '2' },
    { url: '/index.html', revision: '2' },
    { url: '/manifest.webmanifest', revision: '2' },
    { url: '/icons/icon-192.png', revision: '2' },
    { url: '/icons/icon-512.png', revision: '2' },
    { url: '/screenshots/landing-page.png', revision: '1' },
    { url: '/screenshots/dashboard-relatorios.png', revision: '1' },
    { url: '/screenshots/novo-cliente.png', revision: '1' },
    { url: '/screenshots/ordem-coleta-detalhes.png', revision: '1' },
    { url: '/screenshots/novo-frete.png', revision: '1' },
    { url: '/screenshots/cadastro-motorista.png', revision: '1' }
  ]);
}

// Configurar caching de imagens
function setupImageCaching() {
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
    const screenshotUrls = [
      '/screenshots/landing-page.png',
      '/screenshots/dashboard-relatorios.png',
      '/screenshots/novo-cliente.png',
      '/screenshots/ordem-coleta-detalhes.png',
      '/screenshots/novo-frete.png',
      '/screenshots/cadastro-motorista.png'
    ];
    await cache.addAll(screenshotUrls);
    console.log('[Service Worker] Screenshots cacheados');
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
  setupImageCaching();
  setupFontCaching();
  setupResourceCaching();
  setupPagesCaching();
}

export {
  CACHE_NAME,
  APP_SHELL_FILES,
  setupAllCaching,
  cacheAppShell,
  cacheScreenshots
};
