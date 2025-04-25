
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientCombobox } from "./ClientCombobox";
import { Client } from "@/types";

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
  clients: Client[];
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
  clients = [], // Provide default empty array if clients is undefined
}) => {
  // Ensure clients is always an array
  const safeClients = Array.isArray(clients) ? clients : [];
  
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid gap-6">
        <div className="space-y-4">
          <div>
            <Label>Remetente</Label>
            <ClientCombobox
              clients={safeClients}
              value={sender}
              onValueChange={(value, address) => {
                setSender(value);
                if (address) setSenderAddress(address);
              }}
              label="Remetente"
            />
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
          <div>
            <Label>Destinatário</Label>
            <ClientCombobox
              clients={safeClients}
              value={recipient}
              onValueChange={(value, address) => {
                setRecipient(value);
                if (address) setRecipientAddress(address);
              }}
              label="Destinatário"
            />
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
          <div>
            <Label>Expedidor</Label>
            <ClientCombobox
              clients={safeClients}
              value={shipper}
              onValueChange={(value, address) => {
                setShipper(value);
                if (address) setShipperAddress(address);
              }}
              label="Expedidor"
            />
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
          <div>
            <Label>Recebedor</Label>
            <ClientCombobox
              clients={safeClients}
              value={receiver}
              onValueChange={(value, address) => {
                setReceiver(value);
                if (address) setReceiverAddress(address);
              }}
              label="Recebedor"
            />
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
      </CardContent>
    </Card>
  );
};
