
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
  if ('BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window) {
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

// Verificar disponibilidade para instalação
const checkInstallability = async () => {
  return new Promise(resolve => {
    let isInstallable = false;
    let installPromptReceived = false;
    
    // Definir um tempo limite para capturar o evento
    const timeout = setTimeout(() => {
      if (!installPromptReceived) {
        // Verificar com base em user agent para plataformas específicas
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
        const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
        
        resolve({
          installable: isAndroid || isChrome || isSafari,
          method: "userAgent",
          platform: isAndroid ? "Android" : isChrome ? "Chrome Desktop" : isSafari ? "Safari" : "Unknown"
        });
      }
    }, 3000);
    
    // Tenta capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      installPromptReceived = true;
      isInstallable = true;
      clearTimeout(timeout);
      
      resolve({
        installable: true,
        event: "beforeinstallprompt capturado",
        prompt: e
      });
      
      // Armazenar o evento no localStorage como string para debug
      try {
        localStorage.setItem('pwa-install-prompt', JSON.stringify({
          received: true,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.warn('Não foi possível armazenar o evento de instalação no localStorage', err);
      }
      
      // Remover o listener após capturado
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  });
};

// Verificar compatibilidade com a instalação
const checkInstallCompatibility = () => {
  // Verificar se o manifesto tem todos os campos importantes
  const hasRequiredManifestFields = () => {
    try {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      return !!manifestLink;
    } catch (e) {
      return false;
    }
  };
  
  // Verificar se tem ícones adequados
  const hasAdequateIcons = () => {
    // No futuro, podemos verificar se o manifesto tem ícones de tamanho adequado
    return true;
  };
  
  return {
    hasServiceWorker: 'serviceWorker' in navigator,
    hasManifest: hasRequiredManifestFields(),
    hasIcons: hasAdequateIcons(),
    isSecureContext: window.isSecureContext,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isOnline: navigator.onLine,
    isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    isChrome: /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent),
    isSafari: /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent),
    isEdge: /Edge|Edg/i.test(navigator.userAgent),
    isFirefox: /Firefox/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent)
  };
};

// Forçar exibição de prompt de instalação em navegadores compatíveis
const forceInstallPrompt = () => {
  const compatibility = checkInstallCompatibility();
  
  // Se não estiver em standalone mode (já instalado)
  if (!compatibility.isStandalone) {
    // Se for Chrome no Android ou desktop
    if (compatibility.isChrome) {
      // Injetar mini-banner persistente se não houver o oficial
      if (!document.querySelector('#force-install-prompt')) {
        const promptDiv = document.createElement('div');
        promptDiv.id = 'force-install-prompt';
        promptDiv.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background-color:#fff; color:#000; padding:10px; text-align:center; box-shadow:0 -2px 5px rgba(0,0,0,0.2); z-index:9999;';
        promptDiv.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Instale o FreteValor para melhor experiência!</span>
            <div>
              <button id="force-install-ok" style="background:#1E40AF; color:#fff; border:none; padding:5px 10px; margin-right:5px; border-radius:4px;">Instalar</button>
              <button id="force-install-no" style="background:#f1f1f1; border:none; padding:5px 10px; border-radius:4px;">Não agora</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(promptDiv);
        
        document.getElementById('force-install-ok').addEventListener('click', function() {
          alert(`
            Para instalar o FreteValor:
            
            ${compatibility.isAndroid ? 
              '1. Toque no menu ⋮ (três pontos) no canto superior direito\n2. Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"' : 
              '1. Clique no ícone de instalação ⊕ na barra de endereço\n2. Clique em "Instalar"'}
          `);
          promptDiv.remove();
          localStorage.setItem('force-install-dismissed', Date.now().toString());
        });
        
        document.getElementById('force-install-no').addEventListener('click', function() {
          promptDiv.remove();
          localStorage.setItem('force-install-dismissed', Date.now().toString());
        });
      }
    } 
    // Safari no iOS
    else if (compatibility.isSafari && compatibility.isIOS) {
      if (!document.querySelector('#force-install-prompt')) {
        const promptDiv = document.createElement('div');
        promptDiv.id = 'force-install-prompt';
        promptDiv.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background-color:#fff; color:#000; padding:10px; text-align:center; box-shadow:0 -2px 5px rgba(0,0,0,0.2); z-index:9999;';
        promptDiv.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Instale o FreteValor em seu iPhone/iPad!</span>
            <div>
              <button id="force-install-ok" style="background:#1E40AF; color:#fff; border:none; padding:5px 10px; margin-right:5px; border-radius:4px;">Como instalar</button>
              <button id="force-install-no" style="background:#f1f1f1; border:none; padding:5px 10px; border-radius:4px;">Não agora</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(promptDiv);
        
        document.getElementById('force-install-ok').addEventListener('click', function() {
          alert(`
            Para instalar o FreteValor no iOS:
            
            1. Toque no botão compartilhar ↑ na barra inferior do Safari
            2. Role para baixo e toque em "Adicionar à Tela de Início"
            3. Confirme tocando em "Adicionar" no canto superior direito
          `);
          promptDiv.remove();
          localStorage.setItem('force-install-dismissed', Date.now().toString());
        });
        
        document.getElementById('force-install-no').addEventListener('click', function() {
          promptDiv.remove();
          localStorage.setItem('force-install-dismissed', Date.now().toString());
        });
      }
    }
  }
};

// Lançar force install prompt com delay
const launchForceInstallWithDelay = () => {
  const lastDismissed = localStorage.getItem('force-install-dismissed');
  if (lastDismissed) {
    const dismissedTime = parseInt(lastDismissed, 10);
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    if (dismissedTime < twentyFourHoursAgo) {
      setTimeout(forceInstallPrompt, 10000); // 10 segundos após carregar a página
    }
  } else {
    setTimeout(forceInstallPrompt, 10000);
  }
};

// Relatar resultados de validação
const reportPWAStatus = async () => {
  const results = validatePWA();
  const notificationPermission = checkNotificationPermission();
  const networkConnected = await testNetworkConnectivity();
  const isInstalled = isPWAInstalled();
  const installability = await checkInstallability();
  const compatibility = checkInstallCompatibility();
  
  return {
    ...results,
    notificationPermission,
    networkConnected,
    isInstalled,
    installability,
    compatibility,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    display: {
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      browser: window.matchMedia('(display-mode: browser)').matches,
      windowControlsOverlay: window.matchMedia('(display-mode: window-controls-overlay)').matches
    }
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

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Lançar prompt forçado de instalação se aplicável
  if (!isPWAInstalled()) {
    launchForceInstallWithDelay();
  }
});

// Exportar para uso global
self.pwaValidator = {
  validatePWA,
  checkNotificationPermission,
  testNetworkConnectivity,
  isPWAInstalled,
  checkInstallability,
  checkInstallCompatibility,
  forceInstallPrompt,
  reportPWAStatus,
  sendStatusToServiceWorker
};

// Mensagem para desenvolvedores
console.log('[PWA Validator] Para verificar o status do PWA, execute: pwaValidator.reportPWAStatus().then(console.log)');
