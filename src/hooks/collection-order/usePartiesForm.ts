
import { useState } from "react";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";

export const usePartiesForm = (initialData?: {
  sender?: string;
  senderAddress?: string;
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
  const [recipient, setRecipient] = useState(initialData?.recipient || "");
  const [recipientAddress, setRecipientAddress] = useState(initialData?.recipientAddress || "");
  const [shipper, setShipper] = useState(initialData?.shipper || "");
  const [shipperAddress, setShipperAddress] = useState(initialData?.shipperAddress || "");
  const [receiver, setReceiver] = useState(initialData?.receiver || "");
  const [receiverAddress, setReceiverAddress] = useState(initialData?.receiverAddress || "");

  const [selectedSenderId, setSelectedSenderId] = useState<string>(
    user ? user.id : 'none'
  );
  const [selectedSenderType, setSelectedSenderType] = useState<'my-company' | 'client'>(
    'my-company'
  );
  const [senderLogo, setSenderLogo] = useState(user?.companyLogo || '');

  const handleSenderTypeChange = (type: 'my-company' | 'client') => {
    setSelectedSenderType(type);
    if (type === 'my-company' && user) {
      setSelectedSenderId(user.id);
      setSender(user.companyName || '');
      setSenderAddress(user.address || '');
      setSenderLogo(user.companyLogo || '');
    } else {
      setSelectedSenderId('none');
      setSender('');
      setSenderAddress('');
      setSenderLogo('');
    }
  };

  const handleSenderClientChange = (clientId: string, clients: Client[]) => {
    if (clientId === 'none') {
      setSender('');
      setSenderAddress('');
      setSenderLogo('');
      return;
    }

    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setSender(selectedClient.name);
      setSenderAddress(selectedClient.address || '');
      setSenderLogo(selectedClient.logo || '');
      setSelectedSenderId(clientId);
    }
  };

  return {
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
    selectedSenderId,
    selectedSenderType,
    senderLogo,
    handlers: {
      handleSenderTypeChange,
      handleSenderClientChange
    }
  };
};
