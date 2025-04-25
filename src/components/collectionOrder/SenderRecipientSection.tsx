
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid gap-6">
        <div className="space-y-4">
          <div>
            <Label>Nome do Remetente</Label>
            <Input 
              value={sender} 
              onChange={(e) => setSender(e.target.value)} 
              placeholder="Digite o nome do remetente"
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
            <Label>Nome do Destinatário</Label>
            <Input 
              value={recipient} 
              onChange={(e) => setRecipient(e.target.value)} 
              placeholder="Digite o nome do destinatário"
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
            <Label>Nome do Expedidor</Label>
            <Input 
              value={shipper} 
              onChange={(e) => setShipper(e.target.value)} 
              placeholder="Digite o nome do expedidor"
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
            <Label>Nome do Recebedor</Label>
            <Input 
              value={receiver} 
              onChange={(e) => setReceiver(e.target.value)} 
              placeholder="Digite o nome do recebedor"
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
