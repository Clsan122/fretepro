
import React from "react";
import { ClientSelect } from "./ClientSelect";
import { Client } from "@/types"; // Import the Client type from types
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SenderRecipientSectionProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  selectedSenderId: string;
  handleSenderClientChange: (clientId: string) => void;
  clients: Client[];
  shipper: string;
  setShipper: (value: string) => void;
  shipperAddress: string;
  setShipperAddress: (value: string) => void;
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
  selectedSenderId,
  handleSenderClientChange,
  clients,
  shipper,
  setShipper,
  shipperAddress,
  setShipperAddress
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Selecione os clientes nos campos abaixo</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 gap-6">
          <ClientSelect
            label="Remetente"
            clients={clients}
            selectedValue={selectedSenderId}
            onClientChange={handleSenderClientChange}
            clientInfo={sender}
            clientAddress={senderAddress}
          />

          <ClientSelect
            label="Expedidor"
            clients={clients}
            selectedValue={shipper}
            onClientChange={(clientId) => {
              const selectedClient = clients.find(c => c.id === clientId);
              if (selectedClient) {
                setShipper(selectedClient.name);
                setShipperAddress(selectedClient.address || '');
              }
            }}
            clientInfo={shipper}
            clientAddress={shipperAddress}
          />

          <ClientSelect
            label="Destinatário"
            clients={clients}
            selectedValue={recipient}
            onClientChange={(clientId) => {
              const selectedClient = clients.find(c => c.id === clientId);
              if (selectedClient) {
                setRecipient(selectedClient.name);
                setRecipientAddress(selectedClient.address || '');
              }
            }}
            clientInfo={recipient}
            clientAddress={recipientAddress}
          />
        </div>
      </CardContent>
    </Card>
  );
};
