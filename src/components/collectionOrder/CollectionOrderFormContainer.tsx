import React from "react";
import { CollectionOrder } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useCollectionOrderForm } from "@/hooks/useCollectionOrderForm";
import { generateOrderNumber } from "@/utils/orderNumber";
import { SenderRecipientSection } from "./SenderRecipientSection";
import { CargoSection } from "./CargoSection";
import { DriverSection } from "./DriverSection";
import { CompanyLogoSection } from "./CompanyLogoSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { FormActions } from "../freight/FormActions";

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
  const { formData, setters, measurementHandlers } = useCollectionOrderForm({ orderToEdit });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sender || !formData.recipient || !formData.originCity || 
        !formData.originState || !formData.destinationCity || !formData.destinationState) {
      return;
    }

    if (!user) {
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
      userId: user.id
    };

    onSave(newOrder as CollectionOrder);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[100vw] px-0 md:px-4">
      <CompanyLogoSection
        companyLogo={formData.companyLogo}
        handleLogoUpload={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setters.setCompanyLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }}
        handleRemoveLogo={() => setters.setCompanyLogo("")}
        selectedIssuerId={formData.selectedIssuerId}
        onIssuerChange={setters.setSelectedIssuerId}
      />

      <SenderRecipientSection
        sender={formData.sender}
        setSender={setters.setSender}
        senderAddress={formData.senderAddress}
        setSenderAddress={setters.setSenderAddress}
        recipient={formData.recipient}
        setRecipient={setters.setRecipient}
        recipientAddress={formData.recipientAddress}
        setRecipientAddress={setters.setRecipientAddress}
        selectedSenderId={formData.selectedSenderId}
        handleSenderClientChange={setters.handleSenderClientChange}
        clients={formData.clients}
        shipper={formData.shipper}
        setShipper={setters.setShipper}
        shipperAddress={formData.shipperAddress}
        setShipperAddress={setters.setShipperAddress}
        receiver={formData.receiver}
        setReceiver={setters.setReceiver}
        receiverAddress={formData.receiverAddress}
        setReceiverAddress={setters.setReceiverAddress}
      />

      <CargoSection
        volumes={formData.volumes}
        setVolumes={setters.setVolumes}
        weight={formData.weight}
        setWeight={setters.setWeight}
        merchandiseValue={formData.merchandiseValue}
        setMerchandiseValue={setters.setMerchandiseValue}
        cubicMeasurement={formData.cubicMeasurement}
        measurements={formData.measurements}
        handleAddMeasurement={measurementHandlers.handleAddMeasurement}
        handleRemoveMeasurement={measurementHandlers.handleRemoveMeasurement}
        handleMeasurementChange={measurementHandlers.handleMeasurementChange}
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
