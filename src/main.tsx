
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSyncSystem } from './utils/sync.ts';

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

// Registro do Service Worker para o PWA
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js') as ServiceWorkerRegistration;
      
      // Configurar Background Sync
      if ('sync' in registration) {
        try {
          // Registrar sincronização background quando o Service Worker estiver ativo
          await registration.sync.register('database-sync');
          console.log('Background sync registered!');
          
          // Verificar suporte e permissão para periodic sync
          if ('periodicSync' in registration) {
            try {
              // Usando uma abordagem segura para tipo
              const periodicSyncManager = (registration as any).periodicSync;
              
              if (periodicSyncManager) {
                try {
                  // Verificar permissão
                  const status = await navigator.permissions.query({
                    name: 'periodic-background-sync' as PermissionName 
                  });
                  
                  if (status.state === 'granted') {
                    // Registrar periodic sync (uma vez por dia)
                    await periodicSyncManager.register('periodic-sync', {
                      minInterval: 24 * 60 * 60 * 1000 // 24 horas
                    });
                    console.log('Periodic background sync registered!');
                  } else {
                    console.log('Periodic background sync permission not granted.');
                  }
                } catch (err) {
                  console.error('Error registering periodic sync:', err);
                }
              }
            } catch (err) {
              console.error('Error with periodic sync:', err);
            }
          }
        } catch (error) {
          console.error('Error setting up background sync:', error);
        }
      }
      
      // Configurar atualização do Service Worker
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Novo conteúdo disponível; recarregue a página.');
            }
          };
        }
      };
    } catch (error) {
      console.error('Erro ao registrar o Service Worker:', error);
    }
  });
}
