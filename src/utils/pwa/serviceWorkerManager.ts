
import { initializePushNotifications } from '../pushNotifications';

// Interface para estender o tipo ServiceWorkerRegistration com a propriedade sync
interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
  periodicSync?: {
    register(tag: string, options: { minInterval: number }): Promise<void>;
  };
  pushManager: PushManager;
}

export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker não é suportado neste navegador');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });
    
    const extendedReg = registration as unknown as ExtendedServiceWorkerRegistration;
    
    console.log('Service Worker registrado com sucesso:', registration.scope);
    
    // Inicializar notificações push
    await initializePushNotifications();
    console.log('Sistema de notificações push inicializado');
    
    // Configurar Background Sync
    await setupBackgroundSync(extendedReg);
    
    // Configurar detecção de atualizações
    setupUpdateDetection(registration);
    
    // Configurar listeners de mensagens
    setupMessageListeners();
    
    // Configurar listeners de conectividade
    setupConnectivityListeners(extendedReg);
    
  } catch (error) {
    console.error('Erro ao registrar o Service Worker:', error);
  }
}

async function setupBackgroundSync(registration: ExtendedServiceWorkerRegistration): Promise<void> {
  if (!registration.sync) return;

  try {
    await registration.sync.register('database-sync');
    console.log('Background sync registrado!');
    
    if (registration.periodicSync) {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName 
      });
      
      if (status.state === 'granted') {
        await registration.periodicSync.register('periodic-sync', {
          minInterval: 24 * 60 * 60 * 1000 // 24 horas
        });
        console.log('Periodic background sync registrado!');
      } else {
        console.log('Permissão para sincronização periódica não concedida.');
      }
    }
  } catch (error) {
    console.error('Erro ao configurar background sync:', error);
  }
}

function setupUpdateDetection(registration: ServiceWorkerRegistration): void {
  const checkForUpdates = () => {
    if (registration.waiting) {
      console.log('Nova versão do Service Worker detectada');
      window.dispatchEvent(new CustomEvent('sw-update-available', { 
        detail: { registration } 
      }));
    }
  };

  checkForUpdates();
  
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    if (installingWorker) {
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log('Nova versão do Service Worker instalada');
            window.dispatchEvent(new CustomEvent('sw-update-available', { 
              detail: { registration } 
            }));
          } else {
            console.log('Aplicativo pronto para uso offline.');
          }
        }
      };
    }
  };
}

function setupMessageListeners(): void {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_COMPLETED') {
      console.log('Sincronização concluída:', event.data.timestamp);
    }
    
    if (event.data && event.data.type === 'CACHE_COMPLETE') {
      console.log('Cache de screenshots concluído:', event.data.success);
    }

    if (event.data && event.data.type === 'WIDGET_UPDATE_REQUEST') {
      console.log('Solicitação de atualização de widget recebida:', event.data.widgetId);
      
      if (window.widgetManager) {
        window.widgetManager.updateWidgetData(event.data.widgetId)
          .then(data => window.widgetManager.renderWidget(event.data.widgetId, data))
          .then(content => {
            navigator.serviceWorker.controller?.postMessage({
              type: 'WIDGET_UPDATED',
              widget: content
            });
          })
          .catch(err => console.error('Erro ao atualizar widget:', err));
      }
    }
  });
}

function setupConnectivityListeners(registration: ExtendedServiceWorkerRegistration): void {
  window.addEventListener('online', () => {
    console.log('Conexão de rede restaurada');
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ONLINE_STATUS',
        online: true
      });
    }
    
    if (registration.sync) {
      registration.sync.register('database-sync')
        .catch(err => console.error('Erro ao registrar sync quando ficou online:', err));
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('Conexão de rede perdida');
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ONLINE_STATUS',
        online: false
      });
    }
  });
}

export function setupAppEventListeners(): void {
  window.addEventListener('appinstalled', () => {
    console.log('Aplicativo foi instalado!');
  });

  window.addEventListener('beforeunload', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'APP_CLOSING'
      });
    }
  });
}
