
import { useState } from 'react';
import { Client } from '@/types';
import { User } from '@/types';
import { CollectionOrderFormData } from '@/components/collectionOrder/schema';

interface UsePartiesFormProps {
  clients: Client[];
  user: User | null;
}

export const usePartiesForm = ({ clients, user }: UsePartiesFormProps) => {
  // Sender (Remetente)
  const [sender, setSender] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderCnpj, setSenderCnpj] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [senderState, setSenderState] = useState("");
  
  // Recipient (Destinatário)
  const [recipient, setRecipient] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  
  // Shipper (Expedidor)
  const [shipper, setShipper] = useState("");
  const [shipperAddress, setShipperAddress] = useState("");
  
  // Receiver (Recebedor)
  const [receiver, setReceiver] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  
  // Logo and Issuer Selection
  const [senderLogo, setSenderLogo] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState("");
  const [selectedSenderType, setSelectedSenderType] = useState<"client" | "user">("user");
  
  // Receiver form state
  const [showReceiverForm, setShowReceiverForm] = useState(false);

  const handleAddReceiver = () => {
    setShowReceiverForm(true);
  };

  const handleCancelReceiver = () => {
    setShowReceiverForm(false);
    setReceiver("");
    setReceiverAddress("");
  };

  const handleSaveReceiver = () => {
    setShowReceiverForm(false);
  };

  const autoFillTransporter = () => {
    if (user) {
      setSender(user.name || "");
      setSenderAddress(user.address || "");
      setSenderCnpj(user.cpf || "");
      setSenderCity(user.city || "");
      setSenderState(user.state || "");
      setSenderLogo(user.avatar || "");
    }
  };

  const formData = {
    sender,
    senderAddress,
    senderCnpj,
    senderCity,
    senderState,
    recipient,
    recipientAddress,
    shipper,
    shipperAddress,
    receiver,
    receiverAddress,
    selectedSenderId,
    selectedSenderType,
    senderLogo,
  };

  const handlers = {
    setSender,
    setSenderAddress,
    setSenderCnpj,
    setSenderCity,
    setSenderState,
    setRecipient,
    setRecipientAddress,
    setShipper,
    setShipperAddress,
    setReceiver,
    setReceiverAddress,
    setSelectedSenderId,
    setSelectedSenderType,
    setSenderLogo,
  };

  return {
    formData,
    handlers,
    showReceiverForm,
    handleAddReceiver,
    handleCancelReceiver,
    handleSaveReceiver,
    autoFillTransporter,
  };
};
