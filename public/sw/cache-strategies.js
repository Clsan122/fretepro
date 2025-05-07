
// Estratégias de cache para o Service Worker

// Nome do cache atual
const CACHE_NAME = 'fretevalor-v3';

// Lista de arquivos para o app shell
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/src/main.tsx',
  '/src/index.css',
  '/icons/fretevalor-logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Lista de screenshots para armazenar em cache
const SCREENSHOT_FILES = [
  '/screenshots/landing-page.png',
  '/screenshots/dashboard-relatorios.png',
  '/screenshots/novo-cliente.png',
  '/screenshots/ordem-coleta-detalhes.png',
  '/screenshots/novo-frete.png',
  '/screenshots/cadastro-motorista.png'
];

// Configurar estratégias de cache
function setupAllCaching() {
  // Configurar caches e estratégias
  console.log('[Service Worker] Configurando estratégias de cache');
  
  // Páginas HTML principais - Network first, fallback para cache
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAME,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 1 semana
        })
      ]
    })
  );
  
  // Recursos estáticos (JS, CSS) - Stale-While-Revalidate
  workbox.routing.registerRoute(
    ({request}) => 
      request.destination === 'script' || 
      request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `${CACHE_NAME}-static`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
        })
      ]
    })
  );
  
  // Imagens - Cache First
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `${CACHE_NAME}-images`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 24 * 60 * 60 // 60 dias
        })
      ]
    })
  );
  
  // API requests - Network First com cache de fallback
  workbox.routing.registerRoute(
    new RegExp('/api/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: `${CACHE_NAME}-api`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 minutos
        })
      ]
    })
  );
}

// Cache do app shell (arquivos críticos)
async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  console.log('[Service Worker] Armazenando App Shell em cache');
  try {
    await cache.addAll(APP_SHELL_FILES);
    console.log('[Service Worker] App Shell armazenado em cache com sucesso');
    return true;
  } catch (error) {
    console.error('[Service Worker] Erro ao armazenar App Shell em cache:', error);
    return false;
  }
}

// Cache de screenshots
async function cacheScreenshots() {
  const cache = await caches.open(`${CACHE_NAME}-screenshots`);
  console.log('[Service Worker] Armazenando screenshots em cache');
  try {
    await cache.addAll(SCREENSHOT_FILES);
    console.log('[Service Worker] Screenshots armazenados com sucesso');
    return true;
  } catch (error) {
    console.error('[Service Worker] Erro ao armazenar screenshots:', error);
    return false;
  }
}

// Exportar para uso global
self.cacheStrategies = {
  setupAllCaching,
  cacheAppShell,
  cacheScreenshots,
  CACHE_NAME
};
