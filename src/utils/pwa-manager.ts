
/**
 * PWA Manager - Utilitário para gerenciar funcionalidades do PWA
 */

/**
 * Verifica se o Service Worker está registrado e ativo
 */
export const checkServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker não é suportado neste navegador');
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!registration && !!registration.active;
  } catch (error) {
    console.error('Erro ao verificar Service Worker:', error);
    return false;
  }
};

/**
 * Garante que o cache de imagens do PWA seja realizado
 */
export const ensureImageCaching = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    console.warn('Service Worker não está ativo para realizar cache de imagens');
    return false;
  }
  
  return new Promise((resolve) => {
    // Registra um listener temporário para a resposta
    const messageListener = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CACHE_IMAGES_COMPLETE') {
        navigator.serviceWorker.removeEventListener('message', messageListener);
        resolve(event.data.success);
      }
    };
    
    // Adiciona o listener
    navigator.serviceWorker.addEventListener('message', messageListener);
    
    // Define um timeout para resolver após 10 segundos se não houver resposta
    const timeoutId = setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', messageListener);
      console.warn('Timeout ao aguardar confirmação de cache de imagens');
      resolve(false);
    }, 10000);
    
    // Envia solicitação para o Service Worker
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_IMAGES'
    });
  });
};

/**
 * Executa diagnóstico do PWA
 */
export const runPWADiagnostic = async (): Promise<Record<string, any>> => {
  const diagnostics: Record<string, any> = {
    serviceWorkerSupported: 'serviceWorker' in navigator,
    serviceWorkerActive: false,
    manifestPresent: !!document.querySelector('link[rel="manifest"]'),
    installable: false,
    installed: false,
    cacheAPI: 'caches' in window,
    pushNotifications: 'PushManager' in window,
    offlineCapable: false,
    networkStatus: navigator.onLine
  };
  
  // Verifica Service Worker
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    diagnostics.serviceWorkerActive = !!registration && !!registration.active;
    diagnostics.serviceWorkerScope = registration?.scope || 'N/A';
  } catch (error) {
    console.error('Erro ao verificar Service Worker:', error);
  }
  
  // Verifica instalação
  diagnostics.installed = window.matchMedia('(display-mode: standalone)').matches || 
                          window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                          (window.navigator as any).standalone === true;
  
  // Verifica se é instalável (BeforeInstallPrompt é suportado)
  diagnostics.installable = 'BeforeInstallPromptEvent' in window || 
                           'onbeforeinstallprompt' in window;
  
  // Verifica capacidade offline testando o cache
  if ('caches' in window) {
    try {
      const cache = await caches.open('fretevalor-v3');
      const offlinePageInCache = await cache.match('/offline.html');
      diagnostics.offlineCapable = !!offlinePageInCache;
    } catch (error) {
      console.error('Erro ao verificar cache:', error);
    }
  }
  
  return diagnostics;
};

/**
 * Solicita atualização do Service Worker
 */
export const updateServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar Service Worker:', error);
    return false;
  }
};

/**
 * Inicializar o gerenciador PWA
 */
export const initPWAManager = async (): Promise<void> => {
  // Verificar se estamos em ambiente de produção
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Ambiente de desenvolvimento detectado. Algumas funções PWA serão limitadas.');
    return;
  }
  
  // Verificar e garantir o cache de imagens quando online
  if (navigator.onLine) {
    setTimeout(async () => {
      const success = await ensureImageCaching();
      console.log(`Cache de imagens ${success ? 'realizado' : 'falhou'}`);
    }, 2000);
  }
  
  // Registrar listener para mudanças online/offline
  window.addEventListener('online', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ONLINE_STATUS',
        online: true
      });
      
      // Tentar novamente o cache de imagens quando ficar online
      ensureImageCaching();
    }
  });
  
  window.addEventListener('offline', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ONLINE_STATUS',
        online: false
      });
    }
  });
};
