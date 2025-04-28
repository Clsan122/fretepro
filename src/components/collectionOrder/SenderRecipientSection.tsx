
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CNPJLookupField } from "./CNPJLookupField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ClientListDialog } from "@/components/client/ClientListDialog";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";

interface SenderRecipientSectionProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  shipper: string;
  setShipper: (value: string) => void;
  shipperAddress: string;
  setShipperAddress: (value: string) => void;
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  selectedSenderId?: string;
  handleSenderClientChange?: (clientId: string) => void;
  clients?: Client[];
}

export const SenderRecipientSection: React.FC<SenderRecipientSectionProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  recipient,
  setRecipient,
  recipientAddress,
  setRecipientAddress,
  shipper,
  setShipper,
  shipperAddress,
  setShipperAddress,
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
  clients = [],
}) => {
  const { user } = useAuth();
  const [senderDialogOpen, setSenderDialogOpen] = useState(false);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  const [shipperDialogOpen, setShipperDialogOpen] = useState(false);
  const [receiverDialogOpen, setReceiverDialogOpen] = useState(false);
  const [clientsList, setClientsList] = useState<Client[]>([]);

  const loadClients = () => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClientsList(userClients);
    }
  };

  const handleOpenSenderDialog = () => {
    loadClients();
    setSenderDialogOpen(true);
  };

  const handleOpenRecipientDialog = () => {
    loadClients();
    setRecipientDialogOpen(true);
  };

  const handleOpenShipperDialog = () => {
    loadClients();
    setShipperDialogOpen(true);
  };

  const handleOpenReceiverDialog = () => {
    loadClients();
    setReceiverDialogOpen(true);
  };

  const handleSelectSender = (client: Client) => {
    setSender(client.name);
    setSenderAddress(client.address || '');
    setSenderDialogOpen(false);
  };

  const handleSelectRecipient = (client: Client) => {
    setRecipient(client.name);
    setRecipientAddress(client.address || '');
    setRecipientDialogOpen(false);
  };

  const handleSelectShipper = (client: Client) => {
    setShipper(client.name);
    setShipperAddress(client.address || '');
    setShipperDialogOpen(false);
  };

  const handleSelectReceiver = (client: Client) => {
    setReceiver(client.name);
    setReceiverAddress(client.address || '');
    setReceiverDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid gap-6">
        <div className="space-y-4">
          <CNPJLookupField 
            label="CNPJ do Remetente"
            onDataFetched={(data) => {
              setSender(data.name);
              setSenderAddress(data.address);
            }}
          />
          <div>
            <Label>Nome do Remetente</Label>
            <div className="flex gap-2">
              <Input 
                value={sender} 
                onChange={(e) => setSender(e.target.value)} 
                placeholder="Digite o nome do remetente"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleOpenSenderDialog}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Remetente</Label>
            <Input 
              value={senderAddress} 
              onChange={(e) => setSenderAddress(e.target.value)} 
              placeholder="Digite o endereço do remetente"
            />
          </div>
        </div>

        <div className="space-y-4">
          <CNPJLookupField 
            label="CNPJ do Destinatário"
            onDataFetched={(data) => {
              setRecipient(data.name);
              setRecipientAddress(data.address);
            }}
          />
          <div>
            <Label>Nome do Destinatário</Label>
            <div className="flex gap-2">
              <Input 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                placeholder="Digite o nome do destinatário"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleOpenRecipientDialog}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Destinatário</Label>
            <Input 
              value={recipientAddress} 
              onChange={(e) => setRecipientAddress(e.target.value)} 
              placeholder="Digite o endereço do destinatário"
            />
          </div>
        </div>

        <div className="space-y-4">
          <CNPJLookupField 
            label="CNPJ do Expedidor"
            onDataFetched={(data) => {
              setShipper(data.name);
              setShipperAddress(data.address);
            }}
          />
          <div>
            <Label>Nome do Expedidor</Label>
            <div className="flex gap-2">
              <Input 
                value={shipper} 
                onChange={(e) => setShipper(e.target.value)} 
                placeholder="Digite o nome do expedidor"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleOpenShipperDialog}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Expedidor</Label>
            <Input 
              value={shipperAddress} 
              onChange={(e) => setShipperAddress(e.target.value)} 
              placeholder="Digite o endereço do expedidor"
            />
          </div>
        </div>

        <div className="space-y-4">
          <CNPJLookupField 
            label="CNPJ do Recebedor"
            onDataFetched={(data) => {
              setReceiver(data.name);
              setReceiverAddress(data.address);
            }}
          />
          <div>
            <Label>Nome do Recebedor</Label>
            <div className="flex gap-2">
              <Input 
                value={receiver} 
                onChange={(e) => setReceiver(e.target.value)} 
                placeholder="Digite o nome do recebedor"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleOpenReceiverDialog}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Recebedor</Label>
            <Input 
              value={receiverAddress} 
              onChange={(e) => setReceiverAddress(e.target.value)} 
              placeholder="Digite o endereço do recebedor"
            />
          </div>
        </div>

        {/* Diálogos para seleção de clientes */}
        <ClientListDialog 
          clients={clientsList}
          isOpen={senderDialogOpen}
          onClose={() => setSenderDialogOpen(false)}
          onSelectClient={handleSelectSender}
        />
        
        <ClientListDialog 
          clients={clientsList}
          isOpen={recipientDialogOpen}
          onClose={() => setRecipientDialogOpen(false)}
          onSelectClient={handleSelectRecipient}
        />
        
        <ClientListDialog 
          clients={clientsList}
          isOpen={shipperDialogOpen}
          onClose={() => setShipperDialogOpen(false)}
          onSelectClient={handleSelectShipper}
        />
        
        <ClientListDialog 
          clients={clientsList}
          isOpen={receiverDialogOpen}
          onClose={() => setReceiverDialogOpen(false)}
          onSelectClient={handleSelectReceiver}
        />
      </CardContent>
    </Card>
  );
};
