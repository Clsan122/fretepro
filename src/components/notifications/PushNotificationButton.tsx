
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { 
  initializePushNotifications, 
  isPushNotificationEnabled, 
  togglePushNotifications 
} from "@/utils/pushNotifications";
import { toast } from "sonner";

export function PushNotificationButton() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar status apenas uma vez na montagem do componente
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
      await togglePushNotifications();
      setIsEnabled(isPushNotificationEnabled());
    } catch (error) {
      console.error("Erro ao alternar notificações:", error);
      toast.error("Erro ao configurar notificações");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isEnabled ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isEnabled ? (
        <>
          <Bell size={16} />
          <span className="hidden sm:inline">Desativar Notificações</span>
        </>
      ) : (
        <>
          <BellOff size={16} />
          <span className="hidden sm:inline">Ativar Notificações</span>
        </>
      )}
    </Button>
  );
}
