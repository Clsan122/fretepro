
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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionOrderSchema, CollectionOrderFormValues } from "./schema";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

interface CollectionOrderFormContainerProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
  initialData?: Partial<CollectionOrder>;
}

const CollectionOrderFormContainer: React.FC<CollectionOrderFormContainerProps> = ({
  onSave,
  onCancel,
  orderToEdit,
  initialData
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, setters } = useCollectionOrderForm({ 
    orderToEdit, 
    initialData 
  });

  // Configurar o formulário com validação
  const form = useForm<CollectionOrderFormValues>({
    resolver: zodResolver(collectionOrderSchema),
    defaultValues: {
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
      originCity: formData.originCity,
      originState: formData.originState,
      destinationCity: formData.destinationCity,
      destinationState: formData.destinationState,
      volumes: formData.volumes || 0,
      weight: formData.weight || 0,
      merchandiseValue: formData.merchandiseValue || 0,
      invoiceNumber: formData.invoiceNumber || "",
      observations: formData.observations || "",
      driverId: formData.driverId || ""
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    // Encontrar o motorista selecionado
    const selectedDriver = formData.drivers.find(d => d.id === data.driverId);

    // Usar o logo do cliente selecionado se o tipo for 'client'
    const logoToUse = formData.selectedSenderType === 'client' ? formData.senderLogo : formData.companyLogo;

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
      senderLogo: formData.senderLogo, // Adicionando o logo do remetente
      recipient: data.recipient,
      recipientAddress: data.recipientAddress,
      originCity: data.originCity,
      originState: data.originState,
      destinationCity: data.destinationCity,
      destinationState: data.destinationState,
      receiver: data.receiver,
      receiverAddress: data.receiverAddress,
      volumes: data.volumes,
      weight: data.weight,
      measurements: formData.measurements,
      cubicMeasurement: formData.cubicMeasurement,
      merchandiseValue: data.merchandiseValue,
      invoiceNumber: data.invoiceNumber,
      observations: data.observations,
      driverId: data.driverId !== "none" ? data.driverId : undefined,
      driverName: selectedDriver?.name,
      driverCpf: selectedDriver?.cpf,
      licensePlate: selectedDriver?.licensePlate,
      companyLogo: logoToUse, // Usar o logo escolhido com base no tipo
      issuerId: formData.selectedIssuerId,
      createdAt: orderToEdit ? orderToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
      shipper: data.shipper,
      shipperAddress: data.shipperAddress
    };

    console.log('Salvando ordem:', newOrder);

    onSave(newOrder as CollectionOrder);
  });

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
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 print:space-y-2 font-sans print:text-xs">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">
            {orderToEdit ? `Editando Ordem de Coleta: ${orderToEdit.orderNumber}` : 'Nova Ordem de Coleta'}
          </h2>
        </div>

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
          selectedSenderType={formData.selectedSenderType}
          handleSenderTypeChange={setters.handleSenderTypeChange}
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
          form={form}
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
          form={form}
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
          form={form}
        />

        <InvoiceNotesSection
          invoiceNumber={formData.invoiceNumber}
          setInvoiceNumber={setters.setInvoiceNumber}
          observations={formData.observations}
          setObservations={setters.setObservations}
          form={form}
        />

        <DriverSection
          driverId={formData.driverId}
          drivers={formData.drivers}
          setDriverId={setters.setDriverId}
          form={form}
        />

        <FormActions
          onCancel={onCancel}
          isEditing={Boolean(orderToEdit)}
          submitLabel={orderToEdit ? "Atualizar Ordem" : "Cadastrar Ordem"}
        />
      </form>
    </Form>
  );
};

export default CollectionOrderFormContainer;
