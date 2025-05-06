
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./routes/AppRoutes";

// Create connectivity context for sharing online/offline state
interface ConnectivityContextType {
  isOnline: boolean;
}

export const ConnectivityContext = React.createContext<ConnectivityContextType>({
  isOnline: navigator.onLine
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

function App() {
  // Use React.useState explicitly to avoid the null reference error
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [showNotificationButton, setShowNotificationButton] = React.useState<boolean>(false);
  
  React.useEffect(() => {
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
    
    checkNotificationSupport();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <ConnectivityContext.Provider value={{ isOnline }}>
        <NotificationContext.Provider value={{ showNotificationButton, setShowNotificationButton }}>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </NotificationContext.Provider>
      </ConnectivityContext.Provider>
    </BrowserRouter>
  );
}

export default App;
