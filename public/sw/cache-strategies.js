
// Estratégias de cache para o Service Worker

// Nome do cache atual
const CACHE_NAME = 'fretevalor-v4';

// Lista de arquivos para o app shell
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/src/main.tsx',
  '/src/index.css'
];

// Lista de ícones para armazenar em cache
const ICON_FILES = [
  '/icons/fretevalor-logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/android/android-launchericon-512-512.png',
  '/android/android-launchericon-192-192.png',
  '/android/android-launchericon-144-144.png',
  '/android/android-launchericon-96-96.png',
  '/android/android-launchericon-72-72.png',
  '/android/android-launchericon-48-48.png'
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

// Função para fazer o download e cache de uma imagem individual
async function downloadAndCacheImage(url, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      console.log(`[Service Worker] Imagem já em cache: ${url}`);
      return cachedResponse;
    }
    
    console.log(`[Service Worker] Baixando imagem: ${url}`);
    const response = await fetch(url, { mode: 'no-cors' });
    
    if (!response || response.status !== 200) {
      console.error(`[Service Worker] Falha ao buscar imagem: ${url}, Status: ${response.status}`);
      return null;
    }
    
    await cache.put(url, response.clone());
    console.log(`[Service Worker] Imagem armazenada em cache: ${url}`);
    return response;
  } catch (error) {
    console.error(`[Service Worker] Erro ao fazer download e cache da imagem ${url}:`, error);
    return null;
  }
}

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
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
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
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  
  // Imagens - Cache First com estratégia forte de cache
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
  
  // Cache específico para screenshots do PWA
  workbox.routing.registerRoute(
    ({url}) => 
      url.pathname.startsWith('/screenshots/') || 
      url.pathname.startsWith('/icons/') || 
      url.pathname.startsWith('/android/'),
    new workbox.strategies.CacheFirst({
      cacheName: `${CACHE_NAME}-pwa-assets`,
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
  
  // API requests - Network First com cache de fallback
  workbox.routing.registerRoute(
    new RegExp('/api/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: `${CACHE_NAME}-api`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 minutos
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
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

// Cache de ícones
async function cacheIcons() {
  const cache = await caches.open(`${CACHE_NAME}-icons`);
  console.log('[Service Worker] Armazenando ícones em cache');
  try {
    const successfulCaches = await Promise.allSettled(
      ICON_FILES.map(async (iconUrl) => {
        try {
          await downloadAndCacheImage(iconUrl, `${CACHE_NAME}-icons`);
          return true;
        } catch (error) {
          console.error(`[Service Worker] Erro ao armazenar ícone ${iconUrl}:`, error);
          return false;
        }
      })
    );
    
    const allSuccessful = successfulCaches.every(result => result.status === 'fulfilled' && result.value === true);
    console.log('[Service Worker] Ícones armazenados com ' + (allSuccessful ? 'sucesso' : 'alguns erros'));
    return allSuccessful;
  } catch (error) {
    console.error('[Service Worker] Erro ao armazenar ícones:', error);
    return false;
  }
}

// Cache de screenshots
async function cacheScreenshots() {
  const cache = await caches.open(`${CACHE_NAME}-screenshots`);
  console.log('[Service Worker] Armazenando screenshots em cache');
  try {
    const successfulCaches = await Promise.allSettled(
      SCREENSHOT_FILES.map(async (screenshotUrl) => {
        try {
          await downloadAndCacheImage(screenshotUrl, `${CACHE_NAME}-screenshots`);
          return true;
        } catch (error) {
          console.error(`[Service Worker] Erro ao armazenar screenshot ${screenshotUrl}:`, error);
          return false;
        }
      })
    );
    
    const allSuccessful = successfulCaches.every(result => result.status === 'fulfilled' && result.value === true);
    console.log('[Service Worker] Screenshots armazenados com ' + (allSuccessful ? 'sucesso' : 'alguns erros'));
    return allSuccessful;
  } catch (error) {
    console.error('[Service Worker] Erro ao armazenar screenshots:', error);
    return false;
  }
}

// Método para armazenar URLs específicas em cache
async function cacheUrls(urls, cacheName = CACHE_NAME) {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    console.warn('[Service Worker] Nenhuma URL fornecida para cache');
    return false;
  }
  
  console.log(`[Service Worker] Armazenando ${urls.length} URLs em cache "${cacheName}"`);
  try {
    const cache = await caches.open(cacheName);
    const results = await Promise.allSettled(
      urls.map(url => downloadAndCacheImage(url, cacheName))
    );
    
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
    console.log(`[Service Worker] ${successCount}/${urls.length} URLs armazenadas com sucesso`);
    return successCount === urls.length;
  } catch (error) {
    console.error('[Service Worker] Erro ao armazenar URLs em cache:', error);
    return false;
  }
}

// Verificar se todas as imagens do manifesto estão em cache
async function verifyManifestImagesCached() {
  try {
    const manifestResponse = await fetch('/manifest.webmanifest');
    const manifest = await manifestResponse.json();
    
    let imagesToCache = [];
    
    // Adicionar ícones do manifesto
    if (manifest.icons && Array.isArray(manifest.icons)) {
      imagesToCache = imagesToCache.concat(manifest.icons.map(icon => icon.src));
    }
    
    // Adicionar screenshots do manifesto
    if (manifest.screenshots && Array.isArray(manifest.screenshots)) {
      imagesToCache = imagesToCache.concat(manifest.screenshots.map(screenshot => screenshot.src));
    }
    
    // Adicionar ícones dos atalhos
    if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
      manifest.shortcuts.forEach(shortcut => {
        if (shortcut.icons && Array.isArray(shortcut.icons)) {
          imagesToCache = imagesToCache.concat(shortcut.icons.map(icon => icon.src));
        }
      });
    }
    
    // Filtrar URLs únicas
    const uniqueImages = [...new Set(imagesToCache)];
    
    if (uniqueImages.length === 0) {
      console.log('[Service Worker] Nenhuma imagem encontrada no manifesto');
      return false;
    }
    
    // Armazenar todas as imagens do manifesto em cache
    return await cacheUrls(uniqueImages, `${CACHE_NAME}-manifest-images`);
    
  } catch (error) {
    console.error('[Service Worker] Erro ao verificar imagens do manifesto:', error);
    return false;
  }
}

// Exportar para uso global
self.cacheStrategies = {
  setupAllCaching,
  cacheAppShell,
  cacheIcons,
  cacheScreenshots,
  cacheUrls,
  verifyManifestImagesCached,
  CACHE_NAME
};
