
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSyncSystem } from './utils/sync.ts';

// Interface para estender o tipo ServiceWorkerRegistration com a propriedade sync
interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
  periodicSync?: {
    register(tag: string, options: { minInterval: number }): Promise<void>;
  };
}

// Renderizando a aplicação
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Inicializar o sistema de sincronização distribuída
initializeSyncSystem().catch(error => {
  console.error('Erro ao inicializar sistema de sincronização:', error);
});

// Registrar e configurar o Service Worker para o PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js') as ExtendedServiceWorkerRegistration;
      console.log('Service Worker registrado com sucesso:', registration.scope);
      
      // Configurar Background Sync se o navegador suportar
      if (registration.sync) {
        try {
          // Registrar sincronização background quando o Service Worker estiver ativo
          await registration.sync.register('database-sync');
          console.log('Background sync registrado!');
          
          // Verificar suporte e permissão para periodic sync
          if (registration.periodicSync) {
            try {
              // Verificar permissão
              const status = await navigator.permissions.query({
                name: 'periodic-background-sync' as PermissionName 
              });
              
              if (status.state === 'granted') {
                // Registrar periodic sync (uma vez por dia)
                await registration.periodicSync.register('periodic-sync', {
                  minInterval: 24 * 60 * 60 * 1000 // 24 horas
                });
                console.log('Periodic background sync registrado!');
              } else {
                console.log('Permissão para sincronização periódica não concedida.');
              }
            } catch (err) {
              console.error('Erro ao registrar sincronização periódica:', err);
            }
          }
        } catch (error) {
          console.error('Erro ao configurar background sync:', error);
        }
      }
      
      // Configurar atualização do Service Worker
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Service Worker atualizado, notificar usuário
                console.log('Nova versão disponível! Recarregue a página para atualizar.');
                // Aqui você poderia mostrar um toast para o usuário recarregar
              } else {
                // Primeiro Service Worker instalado
                console.log('Aplicativo pronto para uso offline.');
              }
            }
          };
        }
      };
      
      // Ouvir mensagens do Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETED') {
          console.log('Sincronização concluída:', event.data.timestamp);
          // Aqui você poderia atualizar a interface ou mostrar notificação
        }
      });
      
      // Verificar status de conectividade e notificar o Service Worker
      window.addEventListener('online', () => {
        console.log('Conexão de rede restaurada');
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'ONLINE_STATUS',
            online: true
          });
        }
        
        // Iniciar sincronização quando ficar online
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
      
    } catch (error) {
      console.error('Erro ao registrar o Service Worker:', error);
    }
  });
}
