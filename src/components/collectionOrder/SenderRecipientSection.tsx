
import React from "react";
import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientSelect } from "./ClientSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormRow } from "@/components/ui/form-row";

interface AddressInfo {
  name: string;
  address: string;
  city: string;
  state: string;
}

interface SenderRecipientSectionProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  senderCity: string;
  setSenderCity: (value: string) => void;
  senderState: string;
  setSenderState: (value: string) => void;
  
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  recipientCity: string;
  setRecipientCity: (value: string) => void;
  recipientState: string;
  setRecipientState: (value: string) => void;
  
  shipper: string;
  setShipper: (value: string) => void;
  shipperAddress: string;
  setShipperAddress: (value: string) => void;
  shipperCity: string;
  setShipperCity: (value: string) => void;
  shipperState: string;
  setShipperState: (value: string) => void;
  
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  receiverCity: string;
  setReceiverCity: (value: string) => void;
  receiverState: string;
  setReceiverState: (value: string) => void;
  
  selectedSenderId: string;
  handleSenderClientChange: (clientId: string) => void;
  handleClientSelect: (type: 'sender' | 'recipient' | 'shipper' | 'receiver', client: Client) => void;
  clients: Client[];
}

export const SenderRecipientSection: React.FC<SenderRecipientSectionProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  senderCity,
  setSenderCity,
  senderState,
  setSenderState,
  
  recipient,
  setRecipient,
  recipientAddress,
  setRecipientAddress,
  recipientCity,
  setRecipientCity,
  recipientState,
  setRecipientState,
  
  shipper,
  setShipper,
  shipperAddress,
  setShipperAddress,
  shipperCity,
  setShipperCity,
  shipperState,
  setShipperState,
  
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
  receiverCity,
  setReceiverCity,
  receiverState,
  setReceiverState,
  
  selectedSenderId,
  handleSenderClientChange,
  handleClientSelect,
  clients,
}) => {
  
  const renderAddressFields = (
    type: 'sender' | 'recipient' | 'shipper' | 'receiver',
    data: AddressInfo,
    setName: (value: string) => void,
    setAddress: (value: string) => void,
    setCity: (value: string) => void,
    setState: (value: string) => void
  ) => (
    <div className="space-y-3 mt-2">
      <FormRow>
        <div className="w-full">
          <Label htmlFor={`${type}-name`}>Nome</Label>
          <Input
            id={`${type}-name`}
            value={data.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </FormRow>
      <FormRow>
        <div className="w-full">
          <Label htmlFor={`${type}-address`}>Endereço</Label>
          <Input
            id={`${type}-address`}
            value={data.address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </FormRow>
      <FormRow className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`${type}-city`}>Cidade</Label>
          <Input
            id={`${type}-city`}
            value={data.city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`${type}-state`}>Estado</Label>
          <Input
            id={`${type}-state`}
            value={data.state}
            onChange={(e) => setState(e.target.value)}
            maxLength={2}
          />
        </div>
      </FormRow>
    </div>
  );

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Selecione os clientes nos campos abaixo ou preencha os dados manualmente</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        {/* Remetente / Exportador */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Remetente / Exportador</h3>
          <ClientSelect
            label="Selecionar Cliente"
            clients={clients}
            selectedValue={selectedSenderId}
            onClientChange={(clientId) => {
              const selectedClient = clients.find(c => c.id === clientId);
              if (selectedClient) {
                handleClientSelect('sender', selectedClient);
              }
            }}
          />
          {renderAddressFields(
            'sender',
            { name: sender, address: senderAddress, city: senderCity, state: senderState },
            setSender,
            setSenderAddress,
            setSenderCity,
            setSenderState
          )}
        </div>
        
        {/* Destinatário / Importador */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <h3 className="text-lg font-medium">Destinatário / Importador</h3>
          <ClientSelect
            label="Selecionar Cliente"
            clients={clients}
            selectedValue=""
            onClientChange={(clientId) => {
              const selectedClient = clients.find(c => c.id === clientId);
              if (selectedClient) {
                handleClientSelect('recipient', selectedClient);
              }
            }}
          />
          {renderAddressFields(
            'recipient',
            { name: recipient, address: recipientAddress, city: recipientCity, state: recipientState },
            setRecipient,
            setRecipientAddress,
            setRecipientCity,
            setRecipientState
          )}
        </div>
        
        {/* Expedidor / Local de Coleta */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <h3 className="text-lg font-medium">Expedidor / Local de Coleta</h3>
          <ClientSelect
            label="Selecionar Cliente"
            clients={clients}
            selectedValue=""
            onClientChange={(clientId) => {
              const selectedClient = clients.find(c => c.id === clientId);
              if (selectedClient) {
                handleClientSelect('shipper', selectedClient);
              }
            }}
          />
          {renderAddressFields(
            'shipper',
            { name: shipper, address: shipperAddress, city: shipperCity, state: shipperState },
            setShipper,
            setShipperAddress,
            setShipperCity,
            setShipperState
          )}
        </div>
        
        {/* Recebedor / Local de Entrega */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <h3 className="text-lg font-medium">Recebedor / Local de Entrega</h3>
          <ClientSelect
            label="Selecionar Cliente"
            clients={clients}
            selectedValue=""
            onClientChange={(clientId) => {
              const selectedClient = clients.find(c => c.id === clientId);
              if (selectedClient) {
                handleClientSelect('receiver', selectedClient);
              }
            }}
          />
          {renderAddressFields(
            'receiver',
            { name: receiver, address: receiverAddress, city: receiverCity, state: receiverState },
            setReceiver,
            setReceiverAddress,
            setReceiverCity,
            setReceiverState
          )}
        </div>
      </CardContent>
    </Card>
  );
};
