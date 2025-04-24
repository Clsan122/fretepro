
import React from "react";
import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientSelect } from "./ClientSelect";

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
  selectedSenderId,
  handleSenderClientChange,
  clients,
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
        <CardDescription>Selecione os clientes nos campos abaixo</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        <ClientSelect
          label="Remetente"
          clients={clients}
          selectedValue={selectedSenderId}
          onClientChange={handleSenderClientChange}
          clientInfo={sender}
          clientAddress={senderAddress}
        />

        <ClientSelect
          label="Destinatário"
          clients={clients}
          selectedValue={recipient}
          onClientChange={(clientId) => {
            setRecipient(clientId);
            const selectedClient = clients.find(c => c.id === clientId);
            if (selectedClient) {
              setRecipientAddress(selectedClient.address || '');
            }
          }}
          clientInfo={recipient}
          clientAddress={recipientAddress}
        />

        <ClientSelect
          label="Expedidor"
          clients={clients}
          selectedValue={shipper}
          onClientChange={(clientId) => {
            setShipper(clientId);
            const selectedClient = clients.find(c => c.id === clientId);
            if (selectedClient) {
              setShipperAddress(selectedClient.address || '');
            }
          }}
          clientInfo={shipper}
          clientAddress={shipperAddress}
        />

        <ClientSelect
          label="Recebedor"
          clients={clients}
          selectedValue={receiver}
          onClientChange={(clientId) => {
            setReceiver(clientId);
            const selectedClient = clients.find(c => c.id === clientId);
            if (selectedClient) {
              setReceiverAddress(selectedClient.address || '');
            }
          }}
          clientInfo={receiver}
          clientAddress={receiverAddress}
        />
      </CardContent>
    </Card>
  );
};
