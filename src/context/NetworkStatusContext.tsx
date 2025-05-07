
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface NetworkStatusContextType {
  isOnline: boolean;
  lastOnlineAt: Date | null;
}

const NetworkStatusContext = createContext<NetworkStatusContextType | undefined>(undefined);

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(navigator.onLine ? new Date() : null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(new Date());
      
      // Notify service worker
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'ONLINE_STATUS',
          online: true
        });
      }
      
      toast.success("Conexão restaurada", {
        description: "Você está online novamente. Seus dados serão sincronizados."
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      
      // Notify service worker
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'ONLINE_STATUS',
          online: false
        });
      }
      
      toast.warning("Sem conexão", {
        description: "Você está offline. O app continuará funcionando no modo local."
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline, lastOnlineAt }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export const useNetworkStatus = () => {
  const context = useContext(NetworkStatusContext);
  if (context === undefined) {
    throw new Error("useNetworkStatus must be used within a NetworkStatusProvider");
  }
  return context;
};
