
import React, { useEffect } from "react";
import { CollectionOrder } from "@/types";
import { useCollectionOrderForm } from "@/hooks/useCollectionOrderForm";
import { SenderRecipientSection } from "./SenderRecipientSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { DriverSection } from "./DriverSection";
import { FormActions } from "../freight/FormActions";
import { CompanyDetailsSection } from "./sections/CompanyDetailsSection";
import { CargoDetailsSection } from "./sections/CargoDetailsSection";
import { LocationDetailsSection } from "./sections/LocationDetailsSection";
import { v4 as uuidv4 } from "uuid";
import { generateOrderNumber } from "@/utils/orderNumber";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

interface CollectionOrderFormContainerProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
  fromQuotation?: boolean; // Add the fromQuotation prop
}

const CollectionOrderFormContainer: React.FC<CollectionOrderFormContainerProps> = ({
  onSave,
  onCancel,
  orderToEdit,
  fromQuotation = false // Default to false
}) => {
  const { user } = useAuth();
  const { formData, setters } = useCollectionOrderForm({ orderToEdit });
  
  console.log("CollectionOrderFormContainer - orderToEdit:", orderToEdit);
  console.log("CollectionOrderFormContainer - fromQuotation:", fromQuotation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);

    if (!formData.sender || !formData.recipient || !formData.originCity || 
        !formData.originState || !formData.destinationCity || !formData.destinationState || !user) {
      console.error("Dados obrigatórios não preenchidos");
      return;
    }

    const selectedDriver = formData.drivers.find(d => d.id === formData.driverId);

    const newOrder = {
      id: orderToEdit ? orderToEdit.id : uuidv4(),
      orderNumber: orderToEdit ? orderToEdit.orderNumber : generateOrderNumber(),
      sender: formData.sender,
      senderAddress: formData.senderAddress,
      senderCnpj: formData.senderCnpj,
      senderCity: formData.senderCity,
      senderState: formData.senderState,
      recipient: formData.recipient,
      recipientAddress: formData.recipientAddress,
      originCity: formData.originCity,
      originState: formData.originState,
      destinationCity: formData.destinationCity,
      destinationState: formData.destinationState,
      receiver: formData.receiver,
      receiverAddress: formData.receiverAddress,
      volumes: formData.volumes,
      weight: formData.weight,
      measurements: formData.measurements,
      cubicMeasurement: formData.cubicMeasurement,
      merchandiseValue: formData.merchandiseValue,
      invoiceNumber: formData.invoiceNumber,
      observations: formData.observations,
      driverId: formData.driverId !== "none" ? formData.driverId : undefined,
      driverName: selectedDriver?.name,
      driverCpf: selectedDriver?.cpf,
      licensePlate: selectedDriver?.licensePlate,
      companyLogo: formData.companyLogo,
      issuerId: formData.selectedIssuerId,
      createdAt: orderToEdit ? orderToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
      shipper: formData.shipper,
      shipperAddress: formData.shipperAddress,
      fromQuotation: fromQuotation // Add the fromQuotation flag to the order
    };

    console.log("Saving order:", newOrder);
    onSave(newOrder as CollectionOrder);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setters.setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 print:space-y-2 font-sans print:text-xs">
      <CompanyDetailsSection
        companyLogo={formData.companyLogo}
        selectedIssuerId={formData.selectedIssuerId}
        onLogoUpload={handleLogoUpload}
        onLogoRemove={() => setters.setCompanyLogo("")}
        onIssuerChange={setters.setSelectedIssuerId}
      />

      <SenderRecipientSection
        sender={formData.sender}
        senderAddress={formData.senderAddress}
        senderCnpj={formData.senderCnpj}
        senderCity={formData.senderCity}
        senderState={formData.senderState}
        recipient={formData.recipient}
        recipientAddress={formData.recipientAddress}
        shipper={formData.shipper}
        shipperAddress={formData.shipperAddress}
        receiver={formData.receiver}
        receiverAddress={formData.receiverAddress}
        selectedSenderId={formData.selectedSenderId}
        handleSenderClientChange={setters.handleSenderClientChange}
        clients={formData.clients}
        setSender={setters.setSender}
        setSenderAddress={setters.setSenderAddress}
        setSenderCnpj={setters.setSenderCnpj}
        setSenderCity={setters.setSenderCity}
        setSenderState={setters.setSenderState}
        setRecipient={setters.setRecipient}
        setRecipientAddress={setters.setRecipientAddress}
        setShipper={setters.setShipper}
        setShipperAddress={setters.setShipperAddress}
        setReceiver={setters.setReceiver}
        setReceiverAddress={setters.setReceiverAddress}
      />

      <LocationDetailsSection
        originCity={formData.originCity}
        originState={formData.originState}
        destinationCity={formData.destinationCity}
        destinationState={formData.destinationState}
        onOriginCityChange={setters.setOriginCity}
        onOriginStateChange={setters.setOriginState}
        onDestinationCityChange={setters.setDestinationCity}
        onDestinationStateChange={setters.setDestinationState}
      />

      <CargoDetailsSection
        volumes={formData.volumes}
        weight={formData.weight}
        merchandiseValue={formData.merchandiseValue}
        cubicMeasurement={formData.cubicMeasurement}
        measurements={formData.measurements}
        onVolumesChange={setters.setVolumes}
        onWeightChange={setters.setWeight}
        onMerchandiseValueChange={setters.setMerchandiseValue}
        onMeasurementChange={setters.handleMeasurementChange}
        onAddMeasurement={setters.handleAddMeasurement}
        onRemoveMeasurement={setters.handleRemoveMeasurement}
      />

      <InvoiceNotesSection
        invoiceNumber={formData.invoiceNumber}
        setInvoiceNumber={setters.setInvoiceNumber}
        observations={formData.observations}
        setObservations={setters.setObservations}
      />

      <DriverSection
        driverId={formData.driverId}
        drivers={formData.drivers}
        setDriverId={setters.setDriverId}
      />

      <FormActions
        onCancel={onCancel}
        isEditing={Boolean(orderToEdit)}
        submitLabel={orderToEdit ? "Atualizar Ordem" : (fromQuotation ? "Criar Ordem a partir da Cotação" : "Cadastrar Ordem")}
      />
    </form>
  );
};

export default CollectionOrderFormContainer;
