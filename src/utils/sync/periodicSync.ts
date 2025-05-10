
// Configurar sincronização periódica
export const setupPeriodicSync = async (intervalMinutes: number = 15): Promise<boolean> => {
  try {
    // Verificar suporte a sincronização periódica
    if (!('serviceWorker' in navigator) || !('PeriodicSyncManager' in window)) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready as any;
    
    // Verificar permissão
    if (registration.periodicSync) {
      try {
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync' as PermissionName
        });
        
        if (status.state === 'granted') {
          // Registrar sincronização periódica
          await registration.periodicSync.register('periodic-sync', {
            minInterval: intervalMinutes * 60 * 1000 // converter minutos para ms
          });
          return true;
        }
      } catch (error) {
        console.error('Erro ao verificar permissão para sincronização periódica:', error);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao configurar sincronização periódica:', error);
    return false;
  }
};

// Iniciar ouvinte de conexão para sincronizar quando ficar online
export const setupOnlineListener = (): void => {
  window.addEventListener('online', async () => {
    console.log('Conexão online detectada. Iniciando sincronização...');
    
    // Importar aqui para evitar importação circular
    const { syncWithServer } = await import('./onlineSync');
    await syncWithServer();
  });
};
