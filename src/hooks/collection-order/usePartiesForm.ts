import { useState, useEffect } from "react";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";

export const usePartiesForm = (user: User | null, initialData?: {
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
  senderLogo?: string;
}) => {
  const { user: authUser } = useAuth();
  
  // Transportadora (sender)
  const [sender, setSender] = useState(initialData?.sender || "");
  const [senderAddress, setSenderAddress] = useState(initialData?.senderAddress || "");
  const [senderCnpj, setSenderCnpj] = useState(initialData?.senderCnpj || "");
  const [senderCity, setSenderCity] = useState(initialData?.senderCity || "");
  const [senderState, setSenderState] = useState(initialData?.senderState || "");
  
  // Destinatário
  const [recipient, setRecipient] = useState(initialData?.recipient || "");
  const [recipientAddress, setRecipientAddress] = useState(initialData?.recipientAddress || "");
  
  // Remetente (expedidor)
  const [shipper, setShipper] = useState(initialData?.shipper || "");
  const [shipperAddress, setShipperAddress] = useState(initialData?.shipperAddress || "");
  
  // Recebedor
  const [receiver, setReceiver] = useState(initialData?.receiver || "");
  const [receiverAddress, setReceiverAddress] = useState(initialData?.receiverAddress || "");

  // Transportadora pode ser a empresa do usuário ou um cliente
  const [selectedSenderType, setSelectedSenderType] = useState<'my-company' | 'client'>(
    'my-company'
  );
  
  const [selectedSenderId, setSelectedSenderId] = useState<string>(authUser ? authUser.id : 'none');
  const [senderLogo, setSenderLogo] = useState(initialData?.senderLogo || '');

  // Quando o tipo de transportadora muda
  const handleSenderTypeChange = (type: 'my-company' | 'client') => {
    setSelectedSenderType(type);
    if (type === 'my-company' && authUser) {
      // Se for a empresa do usuário, usar dados do usuário
      setSelectedSenderId(authUser.id);
      setSender(authUser.name || '');
      setSenderAddress(authUser.address || '');
      setSenderCnpj(authUser.cnpj || '');
      setSenderCity(authUser.city || '');
      setSenderState(authUser.state || '');
      setSenderLogo(authUser.companyLogo || '');
    } else {
      // Se for cliente, limpar os campos
      setSelectedSenderId('none');
      setSender('');
      setSenderAddress('');
      setSenderCnpj('');
      setSenderCity('');
      setSenderState('');
      setSenderLogo('');
    }
  };

  // Quando seleciona um cliente como transportadora
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

  useEffect(() => {
    if (user) {
      setSender(user.name || '');
      setSenderAddress(user.address || '');
      // Remover referências a CNPJ e companyLogo pois não existem mais
      setSenderLogo(user.avatar || '');
    }
  }, [user]);

  return {
    // Transportadora
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
    
    // Destinatário
    recipient,
    setRecipient,
    recipientAddress,
    setRecipientAddress,
    
    // Remetente (expedidor)
    shipper,
    setShipper,
    shipperAddress,
    setShipperAddress,
    
    // Recebedor
    receiver,
    setReceiver,
    receiverAddress,
    setReceiverAddress,
    
    // Seleção de transportadora
    selectedSenderId,
    selectedSenderType,
    senderLogo,
    setSenderLogo,
    
    handlers: {
      handleSenderTypeChange,
      handleSenderClientChange
    }
  };
};
