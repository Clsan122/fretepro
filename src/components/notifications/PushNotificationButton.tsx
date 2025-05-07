
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { 
  initializePushNotifications, 
  isPushNotificationEnabled, 
  togglePushNotifications,
  sendTestNotification
} from "@/utils/pushNotifications";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PushNotificationButton() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissionState, setPermissionState] = useState<string>("default");

  useEffect(() => {
    // Verificar permissão atual
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }

    async function checkStatus() {
      try {
        await initializePushNotifications();
        setIsEnabled(isPushNotificationEnabled());
      } catch (error) {
        console.error("Erro ao verificar status das notificações:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkStatus();
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await togglePushNotifications();
      setIsEnabled(isPushNotificationEnabled());
      
      if (result) {
        toast.success(isEnabled ? 
          "Notificações desativadas com sucesso" : 
          "Notificações ativadas com sucesso");
        
        // Se acabou de ativar, envia uma notificação de teste
        if (!isEnabled) {
          setTimeout(() => {
            sendTestNotification();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Erro ao alternar notificações:", error);
      toast.error("Erro ao configurar notificações");
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza tooltip diferente dependendo do estado da permissão
  const getTooltipContent = () => {
    if (permissionState === 'denied') {
      return "Notificações bloqueadas no navegador. Verifique as configurações do site.";
    }
    if (isEnabled) {
      return "Clique para desativar notificações";
    }
    return "Clique para ativar notificações";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleToggle}
            disabled={isLoading || permissionState === 'denied'}
            className="flex items-center gap-2"
            aria-label={isEnabled ? "Desativar notificações" : "Ativar notificações"}
          >
            {isEnabled ? (
              <>
                <Bell size={16} />
                <span className="hidden sm:inline">Notificações</span>
              </>
            ) : (
              <>
                <BellOff size={16} />
                <span className="hidden sm:inline">Notificações</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
