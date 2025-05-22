
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types";
import { ClientListDialog } from "@/components/client/ClientListDialog";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";
import { Separator } from "@/components/ui/separator";
import { TransporterSection } from "./sections/TransporterSection";
import { ShipperSection } from "./sections/ShipperSection";
import { RecipientSection } from "./sections/RecipientSection";
import { ReceiverSection } from "./sections/ReceiverSection";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "./schema";

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
  senderLogo?: string;
  setSenderLogo?: (value: string) => void;
  form: UseFormReturn<CollectionOrderFormValues>;
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
  clients = [],
  senderLogo = "",
  setSenderLogo = () => {},
  form
}) => {
  const { user } = useAuth();
  const [senderDialogOpen, setSenderDialogOpen] = useState(false);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  const [shipperDialogOpen, setShipperDialogOpen] = useState(false);
  const [receiverDialogOpen, setReceiverDialogOpen] = useState(false);
  const [clientsList, setClientsList] = useState<Client[]>([]);
  
  const loadClients = () => {
    if (user) {
      try {
        const userClients = getClientsByUserId(user.id);
        setClientsList(Array.isArray(userClients) ? userClients : []);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setClientsList([]);
      }
    } else {
      setClientsList([]);
    }
  };
  
  // Carregar clientes no início
  useEffect(() => {
    loadClients();
  }, [user]);
  
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

  // Garantir que clientsList é sempre um array válido
  const safeClientsList = Array.isArray(clientsList) ? clientsList : [];

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Transportadora, Remetente e Destinatário</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid gap-6">
        {/* SEÇÃO DE TRANSPORTADORA */}
        <TransporterSection 
          sender={sender}
          setSender={setSender}
          senderAddress={senderAddress}
          setSenderAddress={setSenderAddress}
          senderCnpj={senderCnpj}
          setSenderCnpj={setSenderCnpj}
          senderCity={senderCity}
          setSenderCity={setSenderCity}
          senderState={senderState}
          setSenderState={setSenderState}
          selectedSenderType={selectedSenderType}
          handleSenderTypeChange={handleSenderTypeChange}
          handleSenderClientChange={handleSenderClientChange}
          onOpenClientDialog={handleOpenSenderDialog}
          form={form}
          clients={safeClientsList}
          senderLogo={senderLogo}
          setSenderLogo={setSenderLogo}
        />

        <Separator className="my-2" />

        {/* SEÇÃO DE REMETENTE */}
        <ShipperSection 
          shipper={shipper}
          setShipper={setShipper}
          shipperAddress={shipperAddress}
          setShipperAddress={setShipperAddress}
          onOpenClientDialog={handleOpenShipperDialog}
          form={form}
        />

        {/* SEÇÃO DE DESTINATÁRIO */}
        <RecipientSection 
          recipient={recipient}
          setRecipient={setRecipient}
          recipientAddress={recipientAddress}
          setRecipientAddress={setRecipientAddress}
          onOpenClientDialog={handleOpenRecipientDialog}
          form={form}
        />

        {/* SEÇÃO DE RECEBEDOR */}
        <ReceiverSection 
          receiver={receiver}
          setReceiver={setReceiver}
          receiverAddress={receiverAddress}
          setReceiverAddress={setReceiverAddress}
          onOpenClientDialog={handleOpenReceiverDialog}
          form={form}
        />

        {/* Diálogos de seleção de cliente */}
        <ClientListDialog clients={safeClientsList} isOpen={senderDialogOpen} onClose={() => setSenderDialogOpen(false)} onSelectClient={(client) => {
          setSender(client.name);
          setSenderAddress(client.address || '');
          form.setValue("sender", client.name, { shouldValidate: true });
          form.setValue("senderAddress", client.address || '', { shouldValidate: true });

          setSenderCnpj(client.cnpj || '');
          setSenderCity(client.city || '');
          setSenderState(client.state || '');
          if (client.logo) {
            setSenderLogo(client.logo);
          }
          setSenderDialogOpen(false);
          if (handleSenderClientChange) {
            handleSenderClientChange(client.id);
          }
        }} />
        
        <ClientListDialog clients={safeClientsList} isOpen={recipientDialogOpen} onClose={() => setRecipientDialogOpen(false)} onSelectClient={(client) => {
          setRecipient(client.name);
          setRecipientAddress(client.address || '');
          form.setValue("recipient", client.name, { shouldValidate: true });
          form.setValue("recipientAddress", client.address || '', { shouldValidate: true });
          setRecipientDialogOpen(false);
        }} />
        
        <ClientListDialog clients={safeClientsList} isOpen={shipperDialogOpen} onClose={() => setShipperDialogOpen(false)} onSelectClient={(client) => {
          setShipper(client.name);
          setShipperAddress(client.address || '');
          form.setValue("shipper", client.name, { shouldValidate: true });
          form.setValue("shipperAddress", client.address || '', { shouldValidate: true });
          setShipperDialogOpen(false);
        }} />
        
        <ClientListDialog clients={safeClientsList} isOpen={receiverDialogOpen} onClose={() => setReceiverDialogOpen(false)} onSelectClient={(client) => {
          setReceiver(client.name);
          setReceiverAddress(client.address || '');
          form.setValue("receiver", client.name, { shouldValidate: true });
          form.setValue("receiverAddress", client.address || '', { shouldValidate: true });
          setReceiverDialogOpen(false);
        }} />
      </CardContent>
    </Card>
  );
};
