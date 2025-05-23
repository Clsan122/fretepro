
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSyncSystem } from './utils/sync';
import { registerServiceWorker, setupAppEventListeners } from './utils/pwa/serviceWorkerManager';
import { setupResourcePreloading, requestScreenshotCache } from './utils/pwa/resourcePreloader';
import { setupWidgetLoading } from './utils/pwa/widgetManager';

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

// Configurar pré-carregamento de recursos
setupResourcePreloading();

// Configurar sistema de widgets
setupWidgetLoading();

// Configurar listeners de eventos do app
setupAppEventListeners();

// Registrar e configurar o Service Worker para o PWA
window.addEventListener('load', async () => {
  await registerServiceWorker();
  requestScreenshotCache();
});
