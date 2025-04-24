
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";

interface SenderRecipientProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
}

export const SenderRecipientSection: React.FC<SenderRecipientProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  recipient,
  setRecipient,
  recipientAddress,
  setRecipientAddress
}) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedSenderId, setSelectedSenderId] = useState<string>("none");
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("none");

  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
  }, [user]);

  const handleSenderChange = (clientId: string) => {
    setSelectedSenderId(clientId);
    
    if (clientId === "none") {
      return;
    }
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSender(client.name);
      setSenderAddress(client.address || "");
    }
  };

  const handleRecipientChange = (clientId: string) => {
    setSelectedRecipientId(clientId);
    
    if (clientId === "none") {
      return;
    }
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setRecipient(client.name);
      setRecipientAddress(client.address || "");
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Informe os dados do remetente e destinatário</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Selecionar Remetente</Label>
            <Select
              value={selectedSenderId}
              onValueChange={handleSenderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente ou cadastre manualmente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Cadastrar manualmente</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={`sender-${client.id}`} value={client.id}>
                    {client.name} - {client.city}/{client.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Label htmlFor="sender" className="mt-2">Remetente / Exportador</Label>
            <Input
              id="sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Nome do remetente ou exportador"
            />
            
            <Label htmlFor="senderAddress" className="mt-2">Endereço do Remetente</Label>
            <Input
              id="senderAddress"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              placeholder="Endereço completo (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label>Selecionar Destinatário</Label>
            <Select
              value={selectedRecipientId}
              onValueChange={handleRecipientChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente ou cadastre manualmente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Cadastrar manualmente</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={`recipient-${client.id}`} value={client.id}>
                    {client.name} - {client.city}/{client.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Label htmlFor="recipient" className="mt-2">Destinatário / Importador</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nome do destinatário ou importador"
            />
            
            <Label htmlFor="recipientAddress" className="mt-2">Endereço do Destinatário</Label>
            <Input
              id="recipientAddress"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Endereço completo (opcional)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
