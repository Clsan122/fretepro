
// Interface para estender o tipo ServiceWorkerRegistration com a propriedade sync
interface SyncManager {
  register(tag: string): Promise<void>;
}

export interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
  periodicSync?: {
    register(tag: string, options: { minInterval: number }): Promise<void>;
  };
  // Corrigindo o erro TS2430 - tornando pushManager não opcional, mas mantendo
  // a tipagem compatível com a interface original
  pushManager: PushManager;
}

// Lista de screenshots para pré-carregar no cache
export const screenshotUrls = [
  '/screenshots/landing-page.png',
  '/screenshots/dashboard-relatorios.png',
  '/screenshots/novo-cliente.png',
  '/screenshots/ordem-coleta-detalhes.png',
  '/screenshots/novo-frete.png',
  '/screenshots/cadastro-motorista.png'
];

// Registrar e configurar o Service Worker para o PWA
export const registerServiceWorker = async (): Promise<ExtendedServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      // Usando uma variável intermediária com tipagem mais específica
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Garantir que o SW seja sempre atualizado da rede
      });
      
      console.log('Service Worker registrado com sucesso:', registration.scope);
      return registration as unknown as ExtendedServiceWorkerRegistration;
      
    } catch (error) {
      console.error('Erro ao registrar o Service Worker:', error);
      return null;
    }
  }
  return null;
};

// Configurar nova versão do Service Worker
export const configureServiceWorkerUpdates = (registration: ServiceWorkerRegistration): void => {
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    if (installingWorker) {
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Service Worker atualizado, notificar usuário
            console.log('Nova versão disponível! Recarregue a página para atualizar.');
            import('sonner').then(({ toast }) => {
              toast.info(
                'Nova versão disponível', 
                { 
                  description: 'Clique para atualizar e obter as novidades',
                  action: {
                    label: 'Atualizar',
                    onClick: () => window.location.reload()
                  },
                  duration: 10000
                }
              );
            });
          } else {
            // Primeiro Service Worker instalado
            console.log('Aplicativo pronto para uso offline.');
            import('sonner').then(({ toast }) => {
              toast.success('Aplicativo pronto para uso offline');
            });
          }
        }
      };
    }
  };
};

// Configurar sincronização em segundo plano
export const configureBackgroundSync = async (registration: ExtendedServiceWorkerRegistration): Promise<void> => {
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
};

