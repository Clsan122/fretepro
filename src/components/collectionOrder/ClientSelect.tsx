
import React, { useState, useEffect } from "react";
import { Client } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ClientListDialog } from "@/components/client/ClientListDialog";
import { getClientsByUserId } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";

interface ClientSelectProps {
  label: string;
  selectedValue: string;
  onClientChange: (value: string, address?: string, cnpj?: string, city?: string, state?: string) => void;
  className?: string;
}

export const ClientSelect: React.FC<ClientSelectProps> = ({
  label,
  selectedValue,
  onClientChange,
  className
}) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  // Load clients on component mount
  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
  }, [user]);

  const handleOpenDialog = () => {
    // Refresh clients list when dialog is opened
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
    setIsDialogOpen(true);
  };

  const handleSelectClient = (client: Client) => {
    // Pass full client data when a client is selected
    onClientChange(
      client.name, 
      client.address, 
      client.cnpj, 
      client.city, 
      client.state
    );
    setIsDialogOpen(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="font-medium">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={selectedValue}
          onChange={(e) => onClientChange(e.target.value)}
          placeholder={`Digite o nome do ${label.toLowerCase()}`}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleOpenDialog}
          size="icon"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <ClientListDialog 
        clients={clients}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelectClient={handleSelectClient}
      />
    </div>
  );
};
