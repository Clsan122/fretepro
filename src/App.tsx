
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Criar contexto de conectividade para compartilhar estado online/offline
interface ConnectivityContextType {
  isOnline: boolean;
}

export const ConnectivityContext = React.createContext<ConnectivityContextType>({
  isOnline: navigator.onLine
});

// Criar contexto para notificações push
interface NotificationContextType {
  showNotificationButton: boolean;
  setShowNotificationButton: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotificationContext = React.createContext<NotificationContextType>({
  showNotificationButton: false,
  setShowNotificationButton: () => {}
});

function App() {
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [showNotificationButton, setShowNotificationButton] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar suporte a notificações
    const checkNotificationSupport = () => {
      const isSupported = 'Notification' in window && 
                          'serviceWorker' in navigator && 
                          'PushManager' in window;
      setShowNotificationButton(isSupported);
    };
    
    checkNotificationSupport();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <ConnectivityContext.Provider value={{ isOnline }}>
          <NotificationContext.Provider value={{ showNotificationButton, setShowNotificationButton }}>
            <AuthProvider>
              <AppRoutes />
              <Toaster />
              <SonnerToaster position="top-right" richColors />
            </AuthProvider>
          </NotificationContext.Provider>
        </ConnectivityContext.Provider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
