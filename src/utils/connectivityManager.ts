
import { toast } from 'sonner';
import { ExtendedServiceWorkerRegistration } from './serviceWorkerRegistration';

// Configurar listeners de conectividade
export function setupConnectivityListeners(registration: ExtendedServiceWorkerRegistration | null): void {
  // Verificar status de conectividade e notificar o Service Worker
  window.addEventListener('online', () => {
    console.log('Conexão de rede restaurada');
    toast.success('Conexão de rede restaurada');
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ONLINE_STATUS',
        online: true
      });
    }
    
    // Iniciar sincronização quando ficar online
    if (registration?.sync) {
      registration.sync.register('database-sync')
        .catch(err => console.error('Erro ao registrar sync quando ficou online:', err));
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('Conexão de rede perdida');
    toast.error('Conexão de rede perdida. O app continuará funcionando no modo offline.');
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ONLINE_STATUS',
        online: false
      });
    }
  });
}

// Configurar event listeners para mensagens do Service Worker
export function setupServiceWorkerMessageListeners(): void {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_COMPLETED') {
      console.log('Sincronização concluída:', event.data.timestamp);
      toast.success('Sincronização concluída');
    }
    
    if (event.data && event.data.type === 'CACHE_COMPLETE') {
      console.log('Cache de screenshots concluído:', event.data.success);
      if (event.data.success) {
        toast.success('App preparado para uso offline');
      }
    }
  });
}

// Notificar o Service Worker quando o usuário fecha a app
export function setupAppCloseListener(): void {
  window.addEventListener('beforeunload', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'APP_CLOSING'
      });
    }
  });
}

// Adicionar listener específico para recarregar SW
export function setupAppInstallListener(): void {
  window.addEventListener('appinstalled', () => {
    console.log('Aplicativo foi instalado!');
    toast.success('FreteValor instalado com sucesso!');
  });
}
