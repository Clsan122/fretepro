
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UpdateContextType {
  isUpdateAvailable: boolean;
  setIsUpdateAvailable: (available: boolean) => void;
  updateServiceWorker: ServiceWorkerRegistration | null;
  setUpdateServiceWorker: (sw: ServiceWorkerRegistration | null) => void;
  applyUpdate: () => Promise<void>;
}

const UpdateContext = createContext<UpdateContextType>({
  isUpdateAvailable: false,
  setIsUpdateAvailable: () => {},
  updateServiceWorker: null,
  setUpdateServiceWorker: () => {},
  applyUpdate: async () => {},
});

export const useUpdate = () => {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdate must be used within an UpdateProvider');
  }
  return context;
};

interface UpdateProviderProps {
  children: React.ReactNode;
}

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<ServiceWorkerRegistration | null>(null);

  const applyUpdate = async () => {
    if (updateServiceWorker && updateServiceWorker.waiting) {
      // Enviar mensagem para o service worker ativar a nova versão
      updateServiceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Aguardar a ativação e recarregar a página
      updateServiceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  return (
    <UpdateContext.Provider
      value={{
        isUpdateAvailable,
        setIsUpdateAvailable,
        updateServiceWorker,
        setUpdateServiceWorker,
        applyUpdate,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};
