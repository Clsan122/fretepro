
import React from "react";
import { CollectionOrder } from "@/types";
import { useCollectionOrderForm } from "@/hooks/useCollectionOrderForm";
import { SenderRecipientSection } from "./SenderRecipientSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { DriverSection } from "./DriverSection";
import { FormActions } from "../freight/FormActions";
import CompanyDetailsSection from "./sections/CompanyDetailsSection";
import { CargoDetailsSection } from "./sections/CargoDetailsSection";
import { LocationDetailsSection } from "./sections/LocationDetailsSection";
import { v4 as uuidv4 } from "uuid";
import { generateOrderNumber } from "@/utils/orderNumber";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionOrderFormSchema, CollectionOrderFormValues } from "./schema";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

interface CollectionOrderFormContainerProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
  initialData?: Partial<CollectionOrder>;
  isSaving?: boolean;
}

const CollectionOrderFormContainer: React.FC<CollectionOrderFormContainerProps> = ({
  onSave,
  onCancel,
  orderToEdit,
  initialData,
  isSaving = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, handlers } = useCollectionOrderForm({ 
    clients: [],
    user
  });

  // Configurar o formulário com validação
  const form = useForm<CollectionOrderFormValues>({
    resolver: zodResolver(collectionOrderFormSchema),
    defaultValues: {
      orderNumber: formData.orderNumber || "",
      sender: formData.sender,
      senderAddress: formData.senderAddress,
      senderCnpj: formData.senderCnpj || "",
      senderCity: formData.senderCity || "",
      senderState: formData.senderState || "",
      recipient: formData.recipient,
      recipientAddress: formData.recipientAddress,
      shipper: formData.shipper,
      shipperAddress: formData.shipperAddress,
      receiver: formData.receiver || "",
      receiverAddress: formData.receiverAddress || "",
      originCity: formData.originCity || "",
      originState: formData.originState || "",
      destinationCity: formData.destinationCity || "",
      destinationState: formData.destinationState || "",
      cargoDescription: formData.cargoDescription || "",
      weight: formData.weight || 0,
      volumes: formData.volumes || 0,
      value: formData.value || 0,
      notes: formData.notes || "",
      invoiceNotes: formData.invoiceNotes || ""
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    // Manter o ID e orderNumber originais se estivermos editando
    const id = orderToEdit ? orderToEdit.id : uuidv4();
    const orderNumber = orderToEdit ? orderToEdit.orderNumber : generateOrderNumber();

    const newOrder = {
      id: id,
      orderNumber: orderNumber,
      sender: data.sender,
      senderAddress: data.senderAddress,
      senderCnpj: data.senderCnpj || undefined,
      senderCity: data.senderCity || undefined,
      senderState: data.senderState || undefined,
      recipient: data.recipient,
      recipientAddress: data.recipientAddress,
      shipper: data.shipper,
      shipperAddress: data.shipperAddress,
      receiver: data.receiver,
      receiverAddress: data.receiverAddress,
      originCity: data.originCity,
      originState: data.originState,
      destinationCity: data.destinationCity,
      destinationState: data.destinationState,
      cargoDescription: data.cargoDescription,
      weight: data.weight,
      volumes: data.volumes,
      value: data.value,
      notes: data.notes,
      invoiceNotes: data.invoiceNotes,
      measurements: [],
      cubicMeasurement: 0,
      merchandiseValue: data.value,
      invoiceNumber: data.invoiceNotes || "",
      observations: data.notes || "",
      createdAt: orderToEdit ? orderToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
      issuerId: user.id, // Add the missing issuerId property
      syncId: orderToEdit?.syncId,
      syncVersion: orderToEdit ? (orderToEdit.syncVersion || 1) + 1 : 1
    } as CollectionOrder;

    console.log('Salvando ordem:', newOrder);

    onSave(newOrder);
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Handle logo upload
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 print:space-y-2 font-sans print:text-xs">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">
            {orderToEdit ? `Editando Ordem de Coleta: ${orderToEdit.orderNumber}` : 'Nova Ordem de Coleta'}
          </h2>
        </div>

        <CompanyDetailsSection
          selectedIssuerId=""
          onLogoUpload={handleLogoUpload}
          onLogoRemove={() => {}}
          onIssuerChange={() => {}}
          user={user}
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
          selectedSenderId=""
          selectedSenderType="user"
          handleSenderTypeChange={() => {}}
          handleSenderClientChange={() => {}}
          clients={[]}
          setSender={handlers.setSender}
          setSenderAddress={handlers.setSenderAddress}
          setSenderCnpj={handlers.setSenderCnpj}
          setSenderCity={handlers.setSenderCity}
          setSenderState={handlers.setSenderState}
          setRecipient={handlers.setRecipient}
          setRecipientAddress={handlers.setRecipientAddress}
          setShipper={handlers.setShipper}
          setShipperAddress={handlers.setShipperAddress}
          setReceiver={handlers.setReceiver}
          setReceiverAddress={handlers.setReceiverAddress}
          form={form}
          senderLogo=""
          setSenderLogo={() => {}}
        />

        <LocationDetailsSection
          originCity={formData.originCity || ""}
          originState={formData.originState || ""}
          destinationCity={formData.destinationCity || ""}
          destinationState={formData.destinationState || ""}
          onOriginCityChange={() => {}}
          onOriginStateChange={() => {}}
          onDestinationCityChange={() => {}}
          onDestinationStateChange={() => {}}
          form={form}
        />

        <CargoDetailsSection
          volumes={formData.volumes || 0}
          weight={formData.weight || 0}
          merchandiseValue={formData.value || 0}
          cubicMeasurement={0}
          measurements={[]}
          onVolumesChange={() => {}}
          onWeightChange={() => {}}
          onMerchandiseValueChange={() => {}}
          onMeasurementChange={() => {}}
          onAddMeasurement={() => {}}
          onRemoveMeasurement={() => {}}
          form={form}
        />

        <InvoiceNotesSection
          invoiceNumber={formData.invoiceNotes || ""}
          setInvoiceNumber={() => {}}
          observations={formData.notes || ""}
          setObservations={() => {}}
          form={form}
        />

        <DriverSection
          driverId=""
          drivers={[]}
          setDriverId={() => {}}
          form={form}
        />

        <FormActions
          onCancel={onCancel}
          isEditing={Boolean(orderToEdit)}
          submitLabel={orderToEdit ? "Atualizar Ordem" : "Cadastrar Ordem"}
          isSubmitting={isSaving}
        />
      </form>
    </Form>
  );
};

export default CollectionOrderFormContainer;
