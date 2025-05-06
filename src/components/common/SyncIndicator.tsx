
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Database, Wifi, WifiOff, Check, Loader2 } from "lucide-react";
import { checkSyncStatus, startManualSync } from "@/utils/sync";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SyncIndicator: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<{ pending: number }>({ pending: 0 });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        const status = await checkSyncStatus();
        setSyncStatus(status);
      }
    };

    // Check initial status
    checkStatus();

    // Set up interval to check sync status
    const intervalId = setInterval(checkStatus, 30000);

    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for sync completed events from service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SYNC_COMPLETED") {
          checkStatus();
          setSyncing(false);
        }
      });
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isAuthenticated]);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        title: "Você está offline",
        description: "A sincronização será realizada quando você estiver online.",
        variant: "destructive",
      });
      return;
    }

    setSyncing(true);
    const result = await startManualSync();
    setSyncing(false);

    toast({
      title: result.success ? "Sincronização concluída" : "Erro na sincronização",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleManualSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : syncStatus.pending > 0 ? (
              <Database className="h-4 w-4 text-amber-500" />
            ) : (
              <Database className="h-4 w-4 text-green-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {syncing
            ? "Sincronizando dados..."
            : syncStatus.pending > 0
            ? `${syncStatus.pending} itens pendentes de sincronização`
            : "Todos os dados sincronizados"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-8 w-8">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-amber-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isOnline ? "Online" : "Offline - Modo local ativado"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SyncIndicator;
