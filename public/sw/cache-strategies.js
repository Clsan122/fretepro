
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
  '/src/index.css'
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

// Lista de ícones para armazenar em cache
const ICONS_FILES = [
  '/icons/fretevalor-logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/android/android-launchericon-512-512.png',
  '/android/android-launchericon-192-192.png',
  '/android/android-launchericon-144-144.png',
  '/android/android-launchericon-96-96.png',
  '/android/android-launchericon-72-72.png',
  '/android/android-launchericon-48-48.png',
  '/icons/splash/apple-splash-2048-2732.png',
  '/icons/splash/apple-splash-1668-2388.png',
  '/icons/splash/apple-splash-1536-2048.png',
  '/icons/splash/apple-splash-1242-2688.png',
  '/icons/splash/apple-splash-1125-2436.png',
  '/icons/splash/apple-splash-828-1792.png',
  '/icons/splash/apple-splash-750-1334.png',
  '/icons/splash/apple-splash-640-1136.png'
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
  
  // Imagens - Cache First com fallback
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `${CACHE_NAME}-images`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 24 * 60 * 60 // 60 dias
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  
  // Recursos específicos para ícones e screenshots - Cache First com revalidação
  workbox.routing.registerRoute(
    ({url}) => url.pathname.includes('/icons/') || url.pathname.includes('/screenshots/'),
    new workbox.strategies.CacheFirst({
      cacheName: `${CACHE_NAME}-app-assets`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 90 * 24 * 60 * 60 // 90 dias
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  
  // Manifesto - Stale-While-Revalidate
  workbox.routing.registerRoute(
    ({url}) => url.pathname.endsWith('manifest.webmanifest'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `${CACHE_NAME}-manifest`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
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
  const cache = await caches.open(`${CACHE_NAME}-images`);
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

// Cache de ícones
async function cacheIcons() {
  const cache = await caches.open(`${CACHE_NAME}-icons`);
  console.log('[Service Worker] Armazenando ícones em cache');
  try {
    await cache.addAll(ICONS_FILES);
    console.log('[Service Worker] Ícones armazenados com sucesso');
    return true;
  } catch (error) {
    console.error('[Service Worker] Erro ao armazenar ícones:', error);
    
    // Tentar novamente com abordagem alternativa caso falhe
    try {
      console.log('[Service Worker] Tentando método alternativo de cache para ícones');
      await Promise.allSettled(
        ICONS_FILES.map(async (iconPath) => {
          try {
            const response = await fetch(iconPath, { cache: 'no-store' });
            if (response.ok) {
              await cache.put(iconPath, response);
            } else {
              console.warn(`[Service Worker] Não foi possível armazenar: ${iconPath}`);
            }
          } catch (fetchErr) {
            console.warn(`[Service Worker] Erro ao buscar ícone ${iconPath}:`, fetchErr);
          }
        })
      );
      return true;
    } catch (retryError) {
      console.error('[Service Worker] Falha na segunda tentativa de armazenar ícones:', retryError);
      return false;
    }
  }
}

// Função de diagnóstico para verificar cache
async function diagnosticCacheCheck() {
  const allCaches = await caches.keys();
  const report = {};
  
  for (const cacheName of allCaches) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    report[cacheName] = {
      itemCount: keys.length,
      urls: keys.slice(0, 5).map(req => req.url) // Primeiros 5 URLs como amostra
    };
  }
  
  console.log('[Service Worker] Diagnóstico de cache:', report);
  return report;
}

// Exportar para uso global
self.cacheStrategies = {
  setupAllCaching,
  cacheAppShell,
  cacheScreenshots,
  cacheIcons,
  diagnosticCacheCheck,
  CACHE_NAME
};
