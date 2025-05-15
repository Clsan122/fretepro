
import { useState } from "react";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";

export const usePartiesForm = (initialData?: {
  sender?: string;
  senderAddress?: string;
  senderCnpj?: string;
  senderCity?: string;
  senderState?: string;
  recipient?: string;
  recipientAddress?: string;
  shipper?: string;
  shipperAddress?: string;
  receiver?: string;
  receiverAddress?: string;
}) => {
  const { user } = useAuth();
  
  const [sender, setSender] = useState(initialData?.sender || "");
  const [senderAddress, setSenderAddress] = useState(initialData?.senderAddress || "");
  const [senderCnpj, setSenderCnpj] = useState(initialData?.senderCnpj || "");
  const [senderCity, setSenderCity] = useState(initialData?.senderCity || "");
  const [senderState, setSenderState] = useState(initialData?.senderState || "");
  const [recipient, setRecipient] = useState(initialData?.recipient || "");
  const [recipientAddress, setRecipientAddress] = useState(initialData?.recipientAddress || "");
  const [shipper, setShipper] = useState(initialData?.shipper || "");
  const [shipperAddress, setShipperAddress] = useState(initialData?.shipperAddress || "");
  const [receiver, setReceiver] = useState(initialData?.receiver || "");
  const [receiverAddress, setReceiverAddress] = useState(initialData?.receiverAddress || "");

  // Alterado o valor padrão para 'my-company' para que o solicitante seja a transportadora
  const [selectedSenderType, setSelectedSenderType] = useState<'my-company' | 'client'>(
    'my-company'
  );
  
  const [selectedSenderId, setSelectedSenderId] = useState<string>(user ? user.id : 'none');
  const [senderLogo, setSenderLogo] = useState('');

  const handleSenderTypeChange = (type: 'my-company' | 'client') => {
    setSelectedSenderType(type);
    if (type === 'my-company' && user) {
      setSelectedSenderId(user.id);
      setSender(user.name || '');
      setSenderAddress(user.address || '');
      setSenderCnpj(user.cnpj || '');
      setSenderCity(user.city || '');
      setSenderState(user.state || '');
      setSenderLogo(user.companyLogo || '');
    } else {
      setSelectedSenderId('none');
      setSender('');
      setSenderAddress('');
      setSenderCnpj('');
      setSenderCity('');
      setSenderState('');
      setSenderLogo('');
    }
  };

  const handleSenderClientChange = (clientId: string, clients: Client[]) => {
    if (clientId === 'none') {
      setSender('');
      setSenderAddress('');
      setSenderCnpj('');
      setSenderCity('');
      setSenderState('');
      setSenderLogo('');
      return;
    }

    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setSender(selectedClient.name);
      setSenderAddress(selectedClient.address || '');
      setSenderCnpj(selectedClient.cnpj || '');
      setSenderCity(selectedClient.city || '');
      setSenderState(selectedClient.state || '');
      setSenderLogo(selectedClient.logo || '');
      setSelectedSenderId(clientId);
    }
  };

  return {
    sender,
    setSender,
    senderAddress,
    setSenderAddress,
    senderCnpj,
    setSenderCnpj,
    senderCity,
    setSenderCity,
    senderState,
    setSenderState,
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
    selectedSenderType,
    senderLogo,
    handlers: {
      handleSenderTypeChange,
      handleSenderClientChange
    }
  };
};
