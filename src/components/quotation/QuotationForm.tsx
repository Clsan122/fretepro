
import React, { useState, useEffect } from "react";
import { useQuotationForm, QuotationFormData } from "@/hooks/useQuotationForm";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateOrderNumber } from "@/utils/orderNumber";
import { CollectionOrder, Measurement } from "@/types";

// Import our new component sections
import ClientSection from "./ClientSection";
import SenderRecipientSection from "./SenderRecipientSection";
import LocationSection from "./LocationSection";
import CargoSection from "./CargoSection";
import PricingSection from "./PricingSection";
import FormActions from "./FormActions";

interface QuotationFormProps {
  onSave?: (data: QuotationFormData) => void;
  onCancel?: () => void;
  onConvertToOrder?: (order: CollectionOrder) => void;
  initialData?: Partial<QuotationFormData>;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  onSave,
  onCancel,
  onConvertToOrder,
  initialData
}) => {
  const { 
    formData, 
    clients, 
    drivers, 
    updateField, 
    handleClientChange, 
    calculateCubicMeasurement, 
    updateInsurance, 
    updateTotal 
  } = useQuotationForm(initialData);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate initial values on first load
  useEffect(() => {
    updateInsurance();
    updateTotal();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.sender || !formData.recipient || !formData.originCity || !formData.destinationCity) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (onSave) {
      onSave(formData);
    }
    
    toast({
      title: "Cotação salva",
      description: "Cotação salva com sucesso",
    });
    
    setIsSubmitting(false);
  };
  
  const handleConvertToOrder = () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma ordem de coleta",
        variant: "destructive",
      });
      return;
    }
    
    // Calcular a cubagem baseada nas dimensões
    const cubicMeasurement = calculateCubicMeasurement();
    
    // Criar o objeto de medida
    const measurement: Measurement = {
      id: uuidv4(),
      length: formData.length,
      width: formData.width,
      height: formData.height,
      quantity: 1
    };
    
    // Criar a ordem de coleta baseada na cotação
    const newOrder: CollectionOrder = {
      id: uuidv4(),
      orderNumber: generateOrderNumber(),
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
      shipper: formData.shipper,
      shipperAddress: formData.shipperAddress,
      receiver: "", // A ser preenchido depois
      receiverAddress: "", // A ser preenchido depois
      volumes: formData.volumes,
      weight: formData.weight,
      measurements: [measurement],
      cubicMeasurement: cubicMeasurement,
      merchandiseValue: formData.merchandiseValue,
      invoiceNumber: "", // A ser preenchido depois
      observations: formData.observations,
      driverId: formData.driverId !== "none" ? formData.driverId : undefined,
      companyLogo: user.companyLogo || "",
      issuerId: user.id,
      createdAt: new Date().toISOString(),
      userId: user.id
    };
    
    if (onConvertToOrder) {
      onConvertToOrder(newOrder);
    } else {
      // Navegar para a página de criação de ordem com os dados pré-preenchidos
      navigate("/collection-order", { 
        state: { 
          prefillData: newOrder
        } 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
      {/* Cliente */}
      <ClientSection 
        clientId={formData.clientId}
        clients={clients}
        onClientChange={handleClientChange}
      />
      
      {/* Remetente e Destinatário */}
      <SenderRecipientSection 
        sender={formData.sender}
        senderAddress={formData.senderAddress}
        senderCity={formData.senderCity}
        senderState={formData.senderState}
        senderCnpj={formData.senderCnpj || ""}
        recipient={formData.recipient}
        recipientAddress={formData.recipientAddress}
        shipper={formData.shipper}
        shipperAddress={formData.shipperAddress}
        updateField={updateField}
      />
      
      {/* Localização */}
      <LocationSection 
        originState={formData.originState}
        originCity={formData.originCity}
        destinationState={formData.destinationState}
        destinationCity={formData.destinationCity}
        updateField={updateField}
      />
      
      {/* Informações da Carga */}
      <CargoSection 
        volumes={formData.volumes}
        weight={formData.weight}
        merchandiseValue={formData.merchandiseValue}
        length={formData.length}
        width={formData.width}
        height={formData.height}
        vehicleType={formData.vehicleType}
        calculateCubicMeasurement={calculateCubicMeasurement}
        updateField={updateField}
      />
      
      {/* Valor da Cotação */}
      <PricingSection 
        quotedValue={formData.quotedValue}
        toll={formData.toll}
        insurance={formData.insurance}
        insurancePercentage={formData.insurancePercentage}
        others={formData.others}
        totalValue={formData.totalValue}
        observations={formData.observations}
        updateField={updateField}
      />
      
      {/* Botões de Ação */}
      <FormActions 
        onCancel={onCancel}
        onConvertToOrder={handleConvertToOrder}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default QuotationForm;
