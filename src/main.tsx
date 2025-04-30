
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Renderizando a aplicação
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registro do Service Worker para o PWA
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Configurar Background Sync
      if ('SyncManager' in window) {
        try {
          // Registrar sincronização background quando o Service Worker estiver ativo
          registration.ready.then(async (reg) => {
            try {
              // Registrar background sync
              await reg.sync.register('database-sync');
              console.log('Background sync registered!');
              
              // Verificar suporte e permissão para periodic sync
              if ('periodicSync' in reg) {
                try {
                  // Verificar permissão
                  const status = await navigator.permissions.query({
                    name: 'periodic-background-sync',
                  });
                  
                  if (status.state === 'granted') {
                    // Registrar periodic sync (uma vez por dia)
                    await reg.periodicSync.register('fetch-new-content', {
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
              console.error('Error registering background sync:', err);
            }
          });
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

// Função de utilidade para salvar dados para sincronização posterior
export const saveDataForSync = async (data) => {
  // Se online, tente enviar imediatamente
  if (navigator.onLine) {
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log('Error sending data, will use background sync instead:', error);
    }
  }
  
  // Se offline ou falhou ao enviar, salve para sincronização posterior
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      // Salvar no IndexedDB
      const db = await openIndexedDB();
      await saveToIndexedDB(db, data);
      
      // Solicitar sincronização quando estiver online
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('database-sync');
      return true;
    } catch (error) {
      console.error('Error saving data for background sync:', error);
      return false;
    }
  } else {
    console.warn('Background sync not supported in this browser.');
    return false;
  }
};

// Função para abrir o IndexedDB
const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fretepro-offline-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// Função para salvar dados no IndexedDB
const saveToIndexedDB = (db, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pendingSync', 'readwrite');
    const store = transaction.objectStore('pendingSync');
    const request = store.add({
      data,
      timestamp: Date.now()
    });
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
