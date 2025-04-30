
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./routes/AppRoutes";

// Criar contexto de conectividade para compartilhar estado online/offline
interface ConnectivityContextType {
  isOnline: boolean;
}

export const ConnectivityContext = React.createContext<ConnectivityContextType>({
  isOnline: navigator.onLine
});

function App() {
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <ConnectivityContext.Provider value={{ isOnline }}>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ConnectivityContext.Provider>
    </BrowserRouter>
  );
}

export default App;
