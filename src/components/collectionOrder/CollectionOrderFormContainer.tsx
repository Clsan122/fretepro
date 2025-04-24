
import React from "react";
import { CollectionOrder } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useCollectionOrderForm } from "@/hooks/useCollectionOrderForm";
import { generateOrderNumber } from "@/utils/orderNumber";
import { Client } from "@/types";

// Import form sections
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

    if (!formData.sender || !formData.recipient) {
      return;
    }

    if (!user) {
      return;
    }

    const selectedDriver = formData.drivers.find(d => d.id === formData.driverId);

    const newOrder = {
      id: orderToEdit ? orderToEdit.id : uuidv4(),
      orderNumber: orderToEdit ? orderToEdit.orderNumber : generateOrderNumber(),
      
      // Sender details
      sender: formData.sender,
      senderAddress: formData.senderAddress,
      senderCity: formData.senderCity,
      senderState: formData.senderState,
      
      // Recipient details
      recipient: formData.recipient,
      recipientAddress: formData.recipientAddress,
      recipientCity: formData.recipientCity,
      recipientState: formData.recipientState,
      
      // Shipper details
      shipper: formData.shipper,
      shipperAddress: formData.shipperAddress,
      shipperCity: formData.shipperCity,
      shipperState: formData.shipperState,
      
      // Receiver details
      receiver: formData.receiver,
      receiverAddress: formData.receiverAddress,
      receiverCity: formData.receiverCity,
      receiverState: formData.receiverState,
      
      // For backward compatibility
      originCity: formData.senderCity,
      originState: formData.senderState,
      destinationCity: formData.recipientCity,
      destinationState: formData.recipientState,
      
      // Cargo details
      volumes: formData.volumes,
      weight: formData.weight,
      measurements: formData.measurements,
      cubicMeasurement: formData.cubicMeasurement,
      merchandiseValue: formData.merchandiseValue,
      
      // Additional info
      invoiceNumber: formData.invoiceNumber,
      observations: formData.observations,
      
      // Driver info
      driverId: formData.driverId !== "none" ? formData.driverId : undefined,
      driverName: selectedDriver?.name,
      driverCpf: selectedDriver?.cpf,
      licensePlate: selectedDriver?.licensePlate,
      
      // Issuer info
      issuerId: formData.issuerType === 'my-company' ? user.id : formData.selectedIssuerId,
      
      // System fields
      createdAt: orderToEdit ? orderToEdit.createdAt : new Date().toISOString(),
      userId: user.id
    };

    onSave(newOrder as CollectionOrder);
  };

  const handleClientSelect = (type: 'sender' | 'recipient' | 'shipper' | 'receiver', client: Client) => {
    if (!client) return;

    switch (type) {
      case 'sender':
        setters.setSender(client.name);
        setters.setSenderAddress(client.address || '');
        setters.setSenderCity(client.city || '');
        setters.setSenderState(client.state || '');
        break;
      case 'recipient':
        setters.setRecipient(client.name);
        setters.setRecipientAddress(client.address || '');
        setters.setRecipientCity(client.city || '');
        setters.setRecipientState(client.state || '');
        break;
      case 'shipper':
        setters.setShipper(client.name);
        setters.setShipperAddress(client.address || '');
        setters.setShipperCity(client.city || '');
        setters.setShipperState(client.state || '');
        break;
      case 'receiver':
        setters.setReceiver(client.name);
        setters.setReceiverAddress(client.address || '');
        setters.setReceiverCity(client.city || '');
        setters.setReceiverState(client.state || '');
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 print:space-y-2 font-sans print:text-xs">
      <CompanyLogoSection
        selectedIssuerId={formData.selectedIssuerId}
        onIssuerChange={setters.setSelectedIssuerId}
        issuerType={formData.issuerType}
        onIssuerTypeChange={setters.setIssuerType}
      />

      <SenderRecipientSection
        sender={formData.sender}
        setSender={setters.setSender}
        senderAddress={formData.senderAddress}
        setSenderAddress={setters.setSenderAddress}
        senderCity={formData.senderCity}
        setSenderCity={setters.setSenderCity}
        senderState={formData.senderState}
        setSenderState={setters.setSenderState}
        
        recipient={formData.recipient}
        setRecipient={setters.setRecipient}
        recipientAddress={formData.recipientAddress}
        setRecipientAddress={setters.setRecipientAddress}
        recipientCity={formData.recipientCity}
        setRecipientCity={setters.setRecipientCity}
        recipientState={formData.recipientState}
        setRecipientState={setters.setRecipientState}
        
        shipper={formData.shipper}
        setShipper={setters.setShipper}
        shipperAddress={formData.shipperAddress}
        setShipperAddress={setters.setShipperAddress}
        shipperCity={formData.shipperCity}
        setShipperCity={setters.setShipperCity}
        shipperState={formData.shipperState}
        setShipperState={setters.setShipperState}
        
        receiver={formData.receiver}
        setReceiver={setters.setReceiver}
        receiverAddress={formData.receiverAddress}
        setReceiverAddress={setters.setReceiverAddress}
        receiverCity={formData.receiverCity}
        setReceiverCity={setters.setRecipientCity}
        receiverState={formData.receiverState}
        setReceiverState={setters.setReceiverState}
        
        selectedSenderId={formData.selectedSenderId}
        handleSenderClientChange={setters.handleSenderClientChange}
        handleClientSelect={handleClientSelect}
        clients={formData.clients}
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
