
import React from "react";
import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CNPJLookupField } from "./CNPJLookupField";
import { ClientAutocompleteInput } from "@/components/common/ClientAutocompleteInput";

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
  clients = [] // Default to empty array if clients is undefined
}) => {
  // Ensure clients is always an array
  const safeClients = Array.isArray(clients) ? clients : [];

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Preencha os dados ou busque pelo CNPJ</CardDescription>
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
            <ClientAutocompleteInput
              value={sender || ""}
              onChange={setSender}
              onClientSelect={(client) => {
                setSender(client.name);
                setSenderAddress(client.address || "");
              }}
              clients={safeClients}
              label="remetente"
            />
          </div>
          <div>
            <Label>Endereço do Remetente</Label>
            <Input value={senderAddress || ""} onChange={(e) => setSenderAddress(e.target.value)} />
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
            <ClientAutocompleteInput
              value={recipient || ""}
              onChange={setRecipient}
              onClientSelect={(client) => {
                setRecipient(client.name);
                setRecipientAddress(client.address || "");
              }}
              clients={safeClients}
              label="destinatário"
            />
          </div>
          <div>
            <Label>Endereço do Destinatário</Label>
            <Input value={recipientAddress || ""} onChange={(e) => setRecipientAddress(e.target.value)} />
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
            <ClientAutocompleteInput
              value={shipper || ""}
              onChange={setShipper}
              onClientSelect={(client) => {
                setShipper(client.name);
                setShipperAddress(client.address || "");
              }}
              clients={safeClients}
              label="expedidor"
            />
          </div>
          <div>
            <Label>Endereço do Expedidor</Label>
            <Input value={shipperAddress || ""} onChange={(e) => setShipperAddress(e.target.value)} />
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
            <ClientAutocompleteInput
              value={receiver || ""}
              onChange={setReceiver}
              onClientSelect={(client) => {
                setReceiver(client.name);
                setReceiverAddress(client.address || "");
              }}
              clients={safeClients}
              label="recebedor"
            />
          </div>
          <div>
            <Label>Endereço do Recebedor</Label>
            <Input value={receiverAddress || ""} onChange={(e) => setReceiverAddress(e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
