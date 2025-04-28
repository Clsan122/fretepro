
import React, { useState } from "react";
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
  onClientChange: (value: string) => void;
}

export const ClientSelect: React.FC<ClientSelectProps> = ({
  label,
  selectedValue,
  onClientChange
}) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const handleOpenDialog = () => {
    // Buscar clientes do usuário atual quando o diálogo for aberto
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
    setIsDialogOpen(true);
  };

  const handleSelectClient = (client: Client) => {
    onClientChange(client.name);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={selectedValue}
          onChange={(e) => onClientChange(e.target.value)}
          placeholder={`Digite o nome do ${label.toLowerCase()}`}
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
