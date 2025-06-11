
import { useState } from "react";
import { usePartiesForm } from "./collection-order/usePartiesForm";
import { useLocationForm } from "./collection-order/useLocationForm";
import { useCargoForm } from "./collection-order/useCargoForm";
import { useAdditionalInfoForm } from "./collection-order/useAdditionalInfoForm";
import { Client } from "@/types";
import { User } from "@/context/auth/types";

interface UseCollectionOrderFormProps {
  clients: Client[];
  user: User | null;
}

export const useCollectionOrderForm = ({ clients, user }: UseCollectionOrderFormProps) => {
  const [orderNumber, setOrderNumber] = useState("");

  // Use the individual form hooks
  const partiesForm = usePartiesForm({ clients, user });
  const locationForm = useLocationForm();
  const cargoForm = useCargoForm();
  const additionalInfoForm = useAdditionalInfoForm();

  // Combine all form data
  const formData = {
    orderNumber,
    ...partiesForm.formData,
    ...locationForm.formData,
    ...cargoForm.formData,
    ...additionalInfoForm.formData,
  };

  // Combine all handlers
  const handlers = {
    setOrderNumber,
    ...partiesForm.handlers,
    ...locationForm.handlers,
    ...cargoForm.handlers,
    ...additionalInfoForm.handlers,
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
