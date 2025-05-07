
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { 
  isPushNotificationEnabled, 
  togglePushNotifications 
} from "@/utils/pushNotifications";

export const PushNotificationButton: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if push notifications are already enabled
    setEnabled(isPushNotificationEnabled());
  }, []);
  
  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await togglePushNotifications();
      setEnabled(result);
      
      toast.success(result 
        ? "Notificações ativadas com sucesso" 
        : "Notificações desativadas"
      );
    } catch (error) {
      console.error("Erro ao alternar notificações:", error);
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleToggle}
      variant={enabled ? "default" : "outline"}
      size="sm"
      disabled={loading}
      className="flex items-center gap-2"
    >
      {enabled ? (
        <>
          <Bell size={16} />
          <span>Desativar Notificações</span>
        </>
      ) : (
        <>
          <BellOff size={16} />
          <span>Ativar Notificações</span>
        </>
      )}
    </Button>
  );
};

export default PushNotificationButton;
