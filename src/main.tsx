
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSyncSystem } from './utils/sync.ts';
import { initializePushNotifications } from './utils/pushNotifications.ts';
import { 
  registerServiceWorker, 
  configureServiceWorkerUpdates,
  configureBackgroundSync,
  screenshotUrls
} from './utils/serviceWorkerRegistration';
import { 
  preloadScreenshots, 
  requestScreenshotsCache 
} from './utils/preloadResources';
import { 
  setupConnectivityListeners,
  setupServiceWorkerMessageListeners,
  setupAppCloseListener,
  setupAppInstallListener
} from './utils/connectivityManager';

// Renderizando a aplicação - Garantindo que React seja inicializado corretamente
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find root element!");
} else {
  // Usando createRoot da API moderna do React 18
  const root = createRoot(rootElement);
  
  // Renderizando com StrictMode para detectar problemas potenciais
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Inicializar o sistema de sincronização distribuída
initializeSyncSystem().catch(error => {
  console.error('Erro ao inicializar sistema de sincronização:', error);
});

// Inicializar PWA e Service Worker
window.addEventListener('load', async () => {
  // Forçar pré-carregamento de imagens críticas
  setTimeout(() => {
    preloadScreenshots(screenshotUrls);
  }, 2000); // Atrasar o pré-carregamento para não competir com recursos críticos
  
  // Registrar Service Worker apenas se suportado pelo navegador
  if ('serviceWorker' in navigator) {
    const registration = await registerServiceWorker();
    
    if (registration) {
      // Configurar atualizações do Service Worker
      configureServiceWorkerUpdates(registration);
      
      // Inicializar notificações push
      try {
        await initializePushNotifications();
        console.log('Sistema de notificações push inicializado');
      } catch (err) {
        console.error('Erro ao inicializar notificações push:', err);
      }
      
      // Solicitar cache de screenshots
      requestScreenshotsCache(screenshotUrls);
      
      // Configurar sincronização em segundo plano
      await configureBackgroundSync(registration);
      
      // Configurar gerenciamento de conectividade
      setupConnectivityListeners(registration);
      setupServiceWorkerMessageListeners();
    }
  }
  
  // Configurar listeners de ciclo de vida da aplicação
  setupAppInstallListener();
  setupAppCloseListener();
});
