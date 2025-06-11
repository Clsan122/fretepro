
import { useState, useEffect } from "react";
import { CollectionOrder, Driver, Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId, getClientsByUserId } from "@/utils/storage";
import { useCargoForm } from "./collection-order/useCargoForm";
import { usePartiesForm } from "./collection-order/usePartiesForm";
import { useAdditionalInfoForm } from "./collection-order/useAdditionalInfoForm";
import { useLocationForm } from "./collection-order/useLocationForm";

interface UseCollectionOrderFormProps {
  orderToEdit?: CollectionOrder;
  initialData?: Partial<CollectionOrder>;
}

export const useCollectionOrderForm = ({ orderToEdit, initialData }: UseCollectionOrderFormProps) => {
  const { user } = useAuth();
  
  // Combinar dados do orderToEdit e initialData, com preferência para orderToEdit
  const combinedData = {
    ...initialData,
    ...(orderToEdit || {})
  };
  
  // Load external data
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>(combinedData?.companyLogo || "");
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>(
    combinedData?.issuerId || (user ? user.id : "")
  );

  // Initialize sub-forms with combined data
  const cargoForm = useCargoForm(combinedData);
  const partiesForm = usePartiesForm(combinedData);
  const additionalInfoForm = useAdditionalInfoForm(combinedData);
  const locationForm = useLocationForm(combinedData);

  // Load drivers and clients on mount
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);

      // Configurar o tipo de remetente se não estiver em modo de edição
      if (!orderToEdit) {
        partiesForm.handlers.handleSenderTypeChange('client');
      }
    }
  }, [user, orderToEdit]);

  return {
    formData: {
      // Cargo form data
      volumes: cargoForm.volumes,
      weight: cargoForm.weight,
      measurements: cargoForm.measurements,
      cubicMeasurement: cargoForm.cubicMeasurement,
      merchandiseValue: cargoForm.merchandiseValue,

      // Parties form data
      sender: partiesForm.sender,
      senderAddress: partiesForm.senderAddress,
      senderCnpj: partiesForm.senderCnpj,
      senderCity: partiesForm.senderCity,
      senderState: partiesForm.senderState,
      recipient: partiesForm.recipient,
      recipientAddress: partiesForm.recipientAddress,
      shipper: partiesForm.shipper,
      shipperAddress: partiesForm.shipperAddress,
      receiver: partiesForm.receiver,
      receiverAddress: partiesForm.receiverAddress,
      selectedSenderId: partiesForm.selectedSenderId,
      selectedSenderType: partiesForm.selectedSenderType,
      senderLogo: partiesForm.senderLogo,

      // Location form data
      originCity: locationForm.originCity,
      originState: locationForm.originState,
      destinationCity: locationForm.destinationCity,
      destinationState: locationForm.destinationState,

      // Additional info form data
      invoiceNumber: additionalInfoForm.invoiceNumber,
      observations: additionalInfoForm.observations,
      driverId: additionalInfoForm.driverId,

      // External data
      drivers,
      clients,
      
      // Form Logo and Issuer
      companyLogo,
      selectedIssuerId
    },
    setters: {
      // Cargo form handlers
      setVolumes: cargoForm.setVolumes,
      setWeight: cargoForm.setWeight,
      setMerchandiseValue: cargoForm.setMerchandiseValue,
      
      // Measurement handlers
      handleMeasurementChange: cargoForm.handlers.handleMeasurementChange,
      handleAddMeasurement: cargoForm.handlers.handleAddMeasurement,
      handleRemoveMeasurement: cargoForm.handlers.handleRemoveMeasurement,

      // Parties form methods
      setSender: partiesForm.setSender,
      setSenderAddress: partiesForm.setSenderAddress,
      setSenderCnpj: partiesForm.setSenderCnpj,
      setSenderCity: partiesForm.setSenderCity,
      setSenderState: partiesForm.setSenderState,
      setRecipient: partiesForm.setRecipient,
      setRecipientAddress: partiesForm.setRecipientAddress,
      setShipper: partiesForm.setShipper,
      setShipperAddress: partiesForm.setShipperAddress,
      setReceiver: partiesForm.setReceiver,
      setReceiverAddress: partiesForm.setReceiverAddress,
      setSenderLogo: partiesForm.setSenderLogo,
      handleSenderTypeChange: partiesForm.handlers.handleSenderTypeChange,
      handleSenderClientChange: (clientId: string) => {
        partiesForm.handlers.handleSenderClientChange(clientId, clients);
      },

      // Location form setters
      setOriginCity: locationForm.setOriginCity,
      setOriginState: locationForm.setOriginState,
      setDestinationCity: locationForm.setDestinationCity,
      setDestinationState: locationForm.setDestinationState,

      // Additional info form setters
      setInvoiceNumber: additionalInfoForm.setInvoiceNumber,
      setObservations: additionalInfoForm.setObservations,
      setDriverId: additionalInfoForm.setDriverId,

      // Logo and issuer setters
      setCompanyLogo,
      setSelectedIssuerId
    }
  };
};
