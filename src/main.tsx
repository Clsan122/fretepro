
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSyncSystem } from './utils/sync';
import { initializePushNotifications } from './utils/pushNotifications.ts';

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

// Lista de screenshots para pré-carregar no cache
const screenshotUrls = [
  '/screenshots/landing-page.png',
  '/screenshots/dashboard-relatorios.png',
  '/screenshots/novo-cliente.png',
  '/screenshots/ordem-coleta-detalhes.png',
  '/screenshots/novo-frete.png',
  '/screenshots/cadastro-motorista.png'
];

// Renderizando a aplicação
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find root element!");
}

// Inicializar o sistema de sincronização distribuída
initializeSyncSystem().catch(error => {
  console.error('Erro ao inicializar sistema de sincronização:', error);
});

// Pré-carregar screenshots para uso offline
function preloadScreenshots() {
  if (navigator.onLine) {
    screenshotUrls.forEach(url => {
      try {
        const preloadImage = new Image();
        preloadImage.src = url;
        console.log(`Pré-carregando ${url}`);
      } catch (err) {
        console.error(`Erro ao pré-carregar ${url}:`, err);
      }
    });
  }
}

// Carregar o sistema de widgets quando aplicável
function loadWidgets() {
  if ('serviceWorker' in navigator && 'widgets' in window) {
    // Carregar script de widgets
    const widgetScript = document.createElement('script');
    widgetScript.src = '/sw/widgets.js';
    widgetScript.onload = () => {
      // Inicializar widgets quando o script carregar
      if (window.widgetManager && window.widgetManager.init) {
        window.widgetManager.init().then(success => {
          console.log('Sistema de widgets inicializado:', success ? 'com sucesso' : 'com falhas');
        });
      }
    };
    document.body.appendChild(widgetScript);
  }
}

// Forçar pré-carregamento de imagens críticas
window.addEventListener('load', () => {
  setTimeout(() => {
    preloadScreenshots();
    loadWidgets();
  }, 2000); // Atrasar o pré-carregamento para não competir com recursos críticos
});

// Registrar e configurar o Service Worker para o PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Usando uma variável intermediária com tipagem mais específica
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Garantir que o SW seja sempre atualizado da rede
      });
      
      // Agora convertemos para o tipo estendido
      const extendedReg = registration as unknown as ExtendedServiceWorkerRegistration;
      
      console.log('Service Worker registrado com sucesso:', registration.scope);
      
      // Inicializar notificações push
      try {
        await initializePushNotifications();
        console.log('Sistema de notificações push inicializado');
      } catch (err) {
        console.error('Erro ao inicializar notificações push:', err);
      }
      
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
      
      // Detectar atualizações do Service Worker
      const checkForUpdates = () => {
        if (registration.waiting) {
          // Nova versão já disponível
          console.log('Nova versão do Service Worker detectada');
          window.dispatchEvent(new CustomEvent('sw-update-available', { 
            detail: { registration } 
          }));
        }
      };

      // Verificar se já existe uma atualização pendente
      checkForUpdates();
      
      // Configurar nova versão do Service Worker
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Service Worker atualizado, notificar sobre nova versão
                console.log('Nova versão do Service Worker instalada');
                window.dispatchEvent(new CustomEvent('sw-update-available', { 
                  detail: { registration } 
                }));
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
        }
        
        // Removido toast para "Cache de screenshots concluído"
        if (event.data && event.data.type === 'CACHE_COMPLETE') {
          console.log('Cache de screenshots concluído:', event.data.success);
        }

        if (event.data && event.data.type === 'WIDGET_UPDATE_REQUEST') {
          console.log('Solicitação de atualização de widget recebida:', event.data.widgetId);
          
          // Se temos o sistema de widgets carregado
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

// Adicionar listener específico para recarregar SW
window.addEventListener('appinstalled', (evt) => {
  console.log('Aplicativo foi instalado!');
});

// Notificar o Service Worker quando o usuário fecha a app
window.addEventListener('beforeunload', () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'APP_CLOSING'
    });
  }
});
