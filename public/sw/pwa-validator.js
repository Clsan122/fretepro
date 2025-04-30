
// Script para validar PWA e garantir funcionamento adequado

// Verificação de Recursos Essenciais para PWA
const validatePWA = () => {
  const results = {
    serviceWorker: 'serviceWorker' in navigator,
    pushNotifications: 'PushManager' in window,
    cacheAPI: 'caches' in window,
    indexedDB: 'indexedDB' in window,
    manifestPresent: !!document.querySelector('link[rel="manifest"]'),
    offlineSupport: false,
    installability: false,
  };

  // Verificar página offline
  fetch('/offline.html')
    .then(response => {
      results.offlineSupport = response.ok;
    })
    .catch(() => {
      results.offlineSupport = false;
    });

  // Verificar critérios de instalação
  if ('BeforeInstallPromptEvent' in window) {
    results.installability = true;
  }
  
  return results;
};

// Verificar permissões de notificação
const checkNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'não suportado';
  }
  return Notification.permission;
};

// Testar conectividade com a rede
const testNetworkConnectivity = async () => {
  try {
    const response = await fetch('/manifest.webmanifest', { 
      method: 'HEAD', 
      cache: 'no-store' 
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Verificar se o PWA está instalado
const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: window-controls-overlay)').matches ||
         window.navigator.standalone === true;
};

// Relatar resultados de validação
const reportPWAStatus = async () => {
  const results = validatePWA();
  const notificationPermission = checkNotificationPermission();
  const networkConnected = await testNetworkConnectivity();
  const isInstalled = isPWAInstalled();
  
  return {
    ...results,
    notificationPermission,
    networkConnected,
    isInstalled,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
};

// Enviar resultados para o service worker
const sendStatusToServiceWorker = async () => {
  const status = await reportPWAStatus();
  
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PWA_STATUS',
      status
    });
  }
  
  return status;
};

// Exportar para uso global
self.pwaValidator = {
  validatePWA,
  checkNotificationPermission,
  testNetworkConnectivity,
  isPWAInstalled,
  reportPWAStatus,
  sendStatusToServiceWorker
};

// Mensagem para desenvolvedores
console.log('[PWA Validator] Para verificar o status do PWA, execute: sendStatusToServiceWorker().then(console.log)');
