
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SenderRecipientSectionProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  senderCnpj?: string;
  setSenderCnpj?: (value: string) => void;
  senderCity?: string;
  setSenderCity?: (value: string) => void;
  senderState?: string;
  setSenderState?: (value: string) => void;
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
  selectedSenderType?: 'my-company' | 'client';
  handleSenderTypeChange?: (type: 'my-company' | 'client') => void;
  handleSenderClientChange?: (clientId: string) => void;
  clients?: Client[];
}

export const SenderRecipientSection: React.FC<SenderRecipientSectionProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  senderCnpj = "",
  setSenderCnpj = () => {},
  senderCity = "",
  setSenderCity = () => {},
  senderState = "",
  setSenderState = () => {},
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
  selectedSenderId,
  selectedSenderType = 'my-company',
  handleSenderTypeChange = () => {},
  handleSenderClientChange = () => {},
  clients = []
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
    setSenderCnpj(client.cnpj || '');
    setSenderCity(client.city || '');
    setSenderState(client.state || '');
    setSenderDialogOpen(false);
    if (handleSenderClientChange) {
      handleSenderClientChange(client.id);
    }
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
  
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid gap-6">
        <div className="space-y-4">
          {createHighlightedLabel("TRANSPORTADORA / REMETENTE")}
          
          {/* Opção de escolha entre transportadora ou cliente */}
          <RadioGroup 
            value={selectedSenderType} 
            onValueChange={(value) => handleSenderTypeChange(value as 'my-company' | 'client')}
            className="flex gap-4 mb-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="my-company" id="my-company" />
              <Label htmlFor="my-company">Minha Transportadora</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="client" id="client" />
              <Label htmlFor="client">Cliente</Label>
            </div>
          </RadioGroup>
          
          {selectedSenderType === 'client' && (
            <CNPJLookupField 
              label="CNPJ do Remetente" 
              onDataFetched={data => {
                setSender(data.name);
                setSenderAddress(data.address);
                if (data.cnpj) {
                  setSenderCnpj(data.cnpj);
                }
                setSenderCity(data.city);
                setSenderState(data.state);
              }} 
            />
          )}
          
          <div>
            <Label>Nome do {selectedSenderType === 'my-company' ? 'Transportadora' : 'Remetente'}</Label>
            <div className="flex gap-2">
              <Input 
                value={sender} 
                onChange={e => setSender(e.target.value)} 
                placeholder={`Digite o nome ${selectedSenderType === 'my-company' ? 'da transportadora' : 'do remetente'}`} 
                readOnly={selectedSenderType === 'my-company'}
              />
              {selectedSenderType === 'client' && (
                <Button type="button" variant="outline" size="icon" onClick={handleOpenSenderDialog}>
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label>CNPJ {selectedSenderType === 'my-company' ? 'da Transportadora' : 'do Remetente'}</Label>
            <Input 
              value={senderCnpj} 
              onChange={e => setSenderCnpj(e.target.value)} 
              placeholder={`Digite o CNPJ ${selectedSenderType === 'my-company' ? 'da transportadora' : 'do remetente'}`} 
              readOnly={selectedSenderType === 'my-company'}
            />
          </div>
          
          <div>
            <Label>Endereço {selectedSenderType === 'my-company' ? 'da Transportadora' : 'do Remetente'}</Label>
            <Input 
              value={senderAddress} 
              onChange={e => setSenderAddress(e.target.value)} 
              placeholder={`Digite o endereço ${selectedSenderType === 'my-company' ? 'da transportadora' : 'do remetente'}`}
              readOnly={selectedSenderType === 'my-company'} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Cidade</Label>
              <Input 
                value={senderCity} 
                onChange={e => setSenderCity(e.target.value)} 
                placeholder="Cidade" 
                readOnly={selectedSenderType === 'my-company'}
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Input 
                value={senderState} 
                onChange={e => setSenderState(e.target.value)} 
                placeholder="UF" maxLength={2}
                readOnly={selectedSenderType === 'my-company'} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {createHighlightedLabel("DESTINATÁRIO")}
          <CNPJLookupField 
            label="CNPJ do Destinatário" 
            onDataFetched={data => {
              setRecipient(data.name);
              setRecipientAddress(data.address);
            }} 
          />
          <div>
            <Label>Nome do Destinatário</Label>
            <div className="flex gap-2">
              <Input 
                value={recipient} 
                onChange={e => setRecipient(e.target.value)} 
                placeholder="Digite o nome do destinatário" 
              />
              <Button type="button" variant="outline" size="icon" onClick={handleOpenRecipientDialog}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Destinatário</Label>
            <Input 
              value={recipientAddress} 
              onChange={e => setRecipientAddress(e.target.value)} 
              placeholder="Digite o endereço do destinatário" 
            />
          </div>
        </div>

        <div className="space-y-4">
          {createHighlightedLabel("EXPEDIDOR")}
          <CNPJLookupField 
            label="CNPJ do Expedidor" 
            onDataFetched={data => {
              setShipper(data.name);
              setShipperAddress(data.address);
            }} 
          />
          <div>
            <Label>Nome do Expedidor</Label>
            <div className="flex gap-2">
              <Input 
                value={shipper} 
                onChange={e => setShipper(e.target.value)} 
                placeholder="Digite o nome do expedidor" 
              />
              <Button type="button" variant="outline" size="icon" onClick={handleOpenShipperDialog}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Expedidor</Label>
            <Input 
              value={shipperAddress} 
              onChange={e => setShipperAddress(e.target.value)} 
              placeholder="Digite o endereço do expedidor" 
            />
          </div>
        </div>

        <div className="space-y-4">
          {createHighlightedLabel("RECEBEDOR")}
          <CNPJLookupField 
            label="CNPJ do Recebedor" 
            onDataFetched={data => {
              setReceiver(data.name);
              setReceiverAddress(data.address);
            }} 
          />
          <div>
            <Label>Nome do Recebedor</Label>
            <div className="flex gap-2">
              <Input 
                value={receiver} 
                onChange={e => setReceiver(e.target.value)} 
                placeholder="Digite o nome do recebedor" 
              />
              <Button type="button" variant="outline" size="icon" onClick={handleOpenReceiverDialog}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Endereço do Recebedor</Label>
            <Input 
              value={receiverAddress} 
              onChange={e => setReceiverAddress(e.target.value)} 
              placeholder="Digite o endereço do recebedor" 
            />
          </div>
        </div>

        <ClientListDialog clients={clientsList} isOpen={senderDialogOpen} onClose={() => setSenderDialogOpen(false)} onSelectClient={handleSelectSender} />
        
        <ClientListDialog clients={clientsList} isOpen={recipientDialogOpen} onClose={() => setRecipientDialogOpen(false)} onSelectClient={handleSelectRecipient} />
        
        <ClientListDialog clients={clientsList} isOpen={shipperDialogOpen} onClose={() => setShipperDialogOpen(false)} onSelectClient={handleSelectShipper} />
        
        <ClientListDialog clients={clientsList} isOpen={receiverDialogOpen} onClose={() => setReceiverDialogOpen(false)} onSelectClient={handleSelectReceiver} />
      </CardContent>
    </Card>
  );
};
