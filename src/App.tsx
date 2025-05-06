
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { initializeSyncSystem } from "./utils/sync";

// Create connectivity context for sharing online/offline state
interface ConnectivityContextType {
  isOnline: boolean;
  lastSyncTimestamp: string | null;
  setLastSyncTimestamp: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ConnectivityContext = React.createContext<ConnectivityContextType>({
  isOnline: navigator.onLine,
  lastSyncTimestamp: null,
  setLastSyncTimestamp: () => {},
});

// Create context for push notifications
interface NotificationContextType {
  showNotificationButton: boolean;
  setShowNotificationButton: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotificationContext = React.createContext<NotificationContextType>({
  showNotificationButton: false,
  setShowNotificationButton: () => {}
});

function AppContent() {
  // Use React.useState explicitly to avoid the null reference error
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [showNotificationButton, setShowNotificationButton] = React.useState<boolean>(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = React.useState<string | null>(null);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check notification support
    const checkNotificationSupport = () => {
      const isSupported = 'Notification' in window && 
                          'serviceWorker' in navigator && 
                          'PushManager' in window;
      setShowNotificationButton(isSupported);
    };
    
    // Inicializar sistema de sincronização
    initializeSyncSystem().catch(error => {
      console.error('Erro ao inicializar sistema de sincronização:', error);
    });
    
    // Receber mensagens do Service Worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETED') {
          console.log('Sincronização concluída:', event.data.timestamp);
          setLastSyncTimestamp(event.data.timestamp);
        }
      });
    }
    
    checkNotificationSupport();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOnline, lastSyncTimestamp, setLastSyncTimestamp }}>
      <NotificationContext.Provider value={{ showNotificationButton, setShowNotificationButton }}>
        <TooltipProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <SonnerToaster position="top-right" closeButton richColors />
          </AuthProvider>
        </TooltipProvider>
      </NotificationContext.Provider>
    </ConnectivityContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
