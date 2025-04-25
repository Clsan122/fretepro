
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ReceiverFieldsProps {
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
}

export const ReceiverFields: React.FC<ReceiverFieldsProps> = ({
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
}) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>("none");

  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id) || [];
      setClients(userClients);
    }
  }, [user]);

  const handleReceiverChange = (clientId: string) => {
    setSelectedReceiverId(clientId);
    
    if (clientId === "none") {
      return;
    }
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setReceiver(client.name);
      setReceiverAddress(client.address || "");
    }
  };

  return (
    <>
      <div className="mt-4 space-y-2">
        <Label>Selecionar Recebedor</Label>
        <Select
          value={selectedReceiverId}
          onValueChange={handleReceiverChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente ou cadastre manualmente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Cadastrar manualmente</SelectItem>
            {clients.map((client) => (
              <SelectItem key={`receiver-${client.id}`} value={client.id}>
                {client.name} - {client.city}/{client.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 space-y-2">
        <Label htmlFor="receiver">Recebedor</Label>
        <Input
          id="receiver"
          value={receiver || ""}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Nome do recebedor"
        />
      </div>
      
      <div className="mt-4 space-y-2">
        <Label htmlFor="receiverAddress">Endereço do Recebedor</Label>
        <Input
          id="receiverAddress"
          value={receiverAddress || ""}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="Endereço de entrega"
        />
      </div>
    </>
  );
};
