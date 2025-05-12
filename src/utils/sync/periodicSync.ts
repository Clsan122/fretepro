
import { saveLocalData } from './localData';
import { TableName } from './types';

interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  periodicSync?: PeriodicSyncManager;
  sync?: SyncManager;
}

// Configurar sincronização periódica
export const setupPeriodicSync = async (): Promise<boolean> => {
  try {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready as ExtendedServiceWorkerRegistration;
      
      // Verificar suporte a periodic sync (poucos navegadores suportam)
      if (registration.periodicSync) {
        const periodicSync = registration.periodicSync;
        
        // Verificar permissão
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName
        });
        
        if (status.state === 'granted') {
          try {
            await periodicSync.register('periodic-sync', {
              minInterval: 24 * 60 * 60 * 1000 // 24 horas
            });
            console.log('Sincronização periódica configurada');
            return true;
          } catch (error) {
            console.error('Erro ao registrar sincronização periódica:', error);
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao configurar sincronização periódica:', error);
    return false;
  }
};

// Verificar dados em cache durante inicialização
export const checkCachedData = async (): Promise<void> => {
  try {
    if ('caches' in window) {
      const cache = await caches.open('app-data-cache-v1');
      
      // Lista de tipos de dados para verificar
      const dataTypes: TableName[] = [
        'clients',
        'drivers', 
        'freights', 
        'freight_expenses',
        'collection_orders',
        'measurements'
      ];
      
      for (const type of dataTypes) {
        const response = await cache.match(`/api/cached-data/${type}`);
        
        if (response) {
          try {
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
              console.log(`Encontrados ${data.length} itens em cache para ${type}`);
              
              // Salvar cada item no armazenamento local
              for (const item of data) {
                await saveLocalData(type, item);
              }
            }
          } catch (error) {
            console.error(`Erro ao processar dados em cache para ${type}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao verificar dados em cache:', error);
  }
};

// Configurar listener para sincronização quando voltar online
export const setupOnlineListener = (): void => {
  window.addEventListener('online', async () => {
    console.log('Dispositivo online - iniciando sincronização');
    
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready as ExtendedServiceWorkerRegistration;
      
      if (registration.sync) {
        try {
          await registration.sync.register('database-sync');
        } catch (error) {
          console.error('Erro ao registrar sincronização:', error);
        }
      }
    }
  });
};
