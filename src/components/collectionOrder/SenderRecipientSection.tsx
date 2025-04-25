
import React from "react";
import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CNPJLookupField } from "./CNPJLookupField";

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
  selectedSenderId: string;
  handleSenderClientChange: (clientId: string) => void;
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
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Preencha os dados manualmente ou busque pelo CNPJ</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
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
            <Input 
              value={sender || ""} 
              onChange={(e) => setSender(e.target.value)} 
            />
          </div>
          <div>
            <Label>Endereço do Remetente</Label>
            <Input 
              value={senderAddress || ""} 
              onChange={(e) => setSenderAddress(e.target.value)} 
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
            <Input 
              value={recipient || ""} 
              onChange={(e) => setRecipient(e.target.value)} 
            />
          </div>
          <div>
            <Label>Endereço do Destinatário</Label>
            <Input 
              value={recipientAddress || ""} 
              onChange={(e) => setRecipientAddress(e.target.value)} 
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
            <Input 
              value={shipper || ""} 
              onChange={(e) => setShipper(e.target.value)} 
            />
          </div>
          <div>
            <Label>Endereço do Expedidor</Label>
            <Input 
              value={shipperAddress || ""} 
              onChange={(e) => setShipperAddress(e.target.value)} 
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
            <Input 
              value={receiver || ""} 
              onChange={(e) => setReceiver(e.target.value)} 
            />
          </div>
          <div>
            <Label>Endereço do Recebedor</Label>
            <Input 
              value={receiverAddress || ""} 
              onChange={(e) => setReceiverAddress(e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
