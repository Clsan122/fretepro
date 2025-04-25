import React from "react";
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

interface CollectionOrderFormContainerProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
}

const CollectionOrderFormContainer: React.FC<CollectionOrderFormContainerProps> = ({
  onSave,
  onCancel,
  orderToEdit
}) => {
  const { user } = useAuth();
  const { formData, setters } = useCollectionOrderForm({ orderToEdit });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sender || !formData.recipient || !formData.originCity || 
        !formData.originState || !formData.destinationCity || !formData.destinationState || !user) {
      return;
    }

    const selectedDriver = formData.drivers.find(d => d.id === formData.driverId);

    const newOrder = {
      id: orderToEdit ? orderToEdit.id : uuidv4(),
      orderNumber: orderToEdit ? orderToEdit.orderNumber : generateOrderNumber(),
      sender: formData.sender,
      senderAddress: formData.senderAddress,
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
      shipperAddress: formData.shipperAddress
    };

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
        recipient={formData.recipient}
        recipientAddress={formData.recipientAddress}
        shipper={formData.shipper}
        shipperAddress={formData.shipperAddress}
        receiver={formData.receiver}
        receiverAddress={formData.receiverAddress}
        setSender={setters.setSender}
        setSenderAddress={setters.setSenderAddress}
        setRecipient={setters.setRecipient}
        setRecipientAddress={setters.setRecipientAddress}
        setShipper={setters.setShipper}
        setShipperAddress={setters.setShipperAddress}
        setReceiver={setters.setReceiver}
        setReceiverAddress={setters.setReceiverAddress}
        clients={formData.clients}
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
        submitLabel={orderToEdit ? "Atualizar Ordem" : "Cadastrar Ordem"}
      />
    </form>
  );
};

export default CollectionOrderFormContainer;
