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
  // Corrigindo o erro TS2430 - tornando pushManager não opcional, mas mantendo
  // a tipagem compatível com a interface original
  pushManager: PushManager;
}

// Renderizando a aplicação
const root = createRoot(document.getElementById("root")!);
root.render(
  <App />
);

// Inicializar o sistema de sincronização distribuída
initializeSyncSystem().catch(error => {
  console.error('Erro ao inicializar sistema de sincronização:', error);
});

// Lista de screenshots para pré-carregar no cache
const screenshotUrls = [
  '/screenshots/landing-page.png',
  '/screenshots/dashboard-relatorios.png',
  '/screenshots/novo-cliente.png',
  '/screenshots/ordem-coleta-detalhes.png',
  '/screenshots/novo-frete.png',
  '/screenshots/cadastro-motorista.png'
];

// Registrar e configurar o Service Worker para o PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Usando uma variável intermediária com tipagem mais específica
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      // Agora convertemos para o tipo estendido
      const extendedReg = registration as unknown as ExtendedServiceWorkerRegistration;
      
      console.log('Service Worker registrado com sucesso:', registration.scope);
      
      // Pré-carregar screenshots para uso offline
      if (navigator.onLine && navigator.serviceWorker.controller) {
        try {
          // Informar o service worker para adicionar screenshots ao cache
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_SCREENSHOTS',
            urls: screenshotUrls
          });
          console.log('Solicitação para cache de screenshots enviada');
        } catch (err) {
          console.error('Erro ao solicitar cache de screenshots:', err);
        }
      }
      
      // Configurar Background Sync se o navegador suportar
      if (extendedReg.sync) {
        try {
          // Registrar sincronização background quando o Service Worker estiver ativo
          await extendedReg.sync.register('database-sync');
          console.log('Background sync registrado!');
          
          // Verificar suporte e permissão para periodic sync
          if (extendedReg.periodicSync) {
            try {
              // Verificar permissão
              const status = await navigator.permissions.query({
                name: 'periodic-background-sync' as PermissionName 
              });
              
              if (status.state === 'granted') {
                // Registrar periodic sync (uma vez por dia)
                await extendedReg.periodicSync.register('periodic-sync', {
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
      
      // Configurar Push Notifications
      if (registration.pushManager) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            // Tentar se inscrever para notificações push
            const subscribeOptions = {
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
              )
            };
            
            const subscription = await registration.pushManager.subscribe(subscribeOptions);
            console.log('Push Notification subscription:', subscription);
            
            // Aqui você deveria enviar a subscription para o seu servidor
            // para armazenar e usar para enviar notificações push
          } else {
            console.log('Permissão para notificações não concedida');
          }
        } catch (error) {
          console.error('Erro ao configurar push notifications:', error);
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
        
        if (event.data && event.data.type === 'CACHE_COMPLETE') {
          console.log('Cache de screenshots concluído:', event.data.success);
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
        if (extendedReg.sync) {
          extendedReg.sync.register('database-sync')
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

// Função auxiliar para converter base64 para Uint8Array (usado para VAPID keys)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
