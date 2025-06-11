
import { useState } from "react";
import { usePartiesForm } from "./collection-order/usePartiesForm";
import { Client } from "@/types";
import { User } from "@/types";

interface UseCollectionOrderFormProps {
  clients: Client[];
  user: User | null;
}

export const useCollectionOrderForm = ({ clients, user }: UseCollectionOrderFormProps) => {
  const [orderNumber, setOrderNumber] = useState("");
  
  // Location form state
  const [originCity, setOriginCity] = useState("");
  const [originState, setOriginState] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationState, setDestinationState] = useState("");
  
  // Cargo form state
  const [volumes, setVolumes] = useState(0);
  const [weight, setWeight] = useState(0);
  const [value, setValue] = useState(0);
  const [cargoDescription, setCargoDescription] = useState("");
  
  // Additional info form state
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [notes, setNotes] = useState("");

  // Use the individual form hooks
  const partiesForm = usePartiesForm({ clients, user });

  // Combine all form data
  const formData = {
    orderNumber,
    originCity,
    originState,
    destinationCity,
    destinationState,
    volumes,
    weight,
    value,
    cargoDescription,
    invoiceNotes,
    notes,
    ...partiesForm.formData,
  };

  // Combine all handlers
  const handlers = {
    setOrderNumber,
    setOriginCity,
    setOriginState,
    setDestinationCity,
    setDestinationState,
    setVolumes,
    setWeight,
    setValue,
    setCargoDescription,
    setInvoiceNotes,
    setNotes,
    ...partiesForm.handlers,
  };

  // Auto-fill transporter info
  const autoFillTransporter = () => {
    if (user) {
      partiesForm.handlers.setSender(user.name || "");
      partiesForm.handlers.setSenderAddress(user.address || "");
      partiesForm.handlers.setSenderCnpj(user.cpf || "");
      partiesForm.handlers.setSenderCity(user.city || "");
      partiesForm.handlers.setSenderState(user.state || "");
      partiesForm.handlers.setRecipient(user.name || "");
      partiesForm.handlers.setRecipientAddress(user.address || "");
      partiesForm.handlers.setShipper(user.name || "");
      partiesForm.handlers.setShipperAddress(user.address || "");
      partiesForm.handlers.setReceiver(user.name || "");
      partiesForm.handlers.setReceiverAddress(user.address || "");
      partiesForm.handlers.setSelectedSenderId(user.id);
      partiesForm.handlers.setSelectedSenderType("user");
      partiesForm.handlers.setSenderLogo(user.avatar || "");
    }
  };

  return {
    formData,
    handlers,
    // Include functions from partiesForm
    showReceiverForm: partiesForm.showReceiverForm,
    handleAddReceiver: partiesForm.handleAddReceiver,
    handleCancelReceiver: partiesForm.handleCancelReceiver,
    handleSaveReceiver: partiesForm.handleSaveReceiver,
    autoFillTransporter,
  };
};
