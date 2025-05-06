
import React, { useState, useEffect, useRef } from "react";
import { useQuotationForm, QuotationFormData } from "@/hooks/useQuotationForm";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CollectionOrder, Client } from "@/types";
import { LogoUpload } from "@/components/client/LogoUpload";
import { getClientById } from "@/utils/storage";

// Import our component sections
import ClientSection from "./ClientSection";
import SenderRecipientSection from "./SenderRecipientSection";
import LocationSection from "./LocationSection";
import CargoSection from "./CargoSection";
import PricingSection from "./PricingSection";
import FormActions from "./FormActions";
import QuotationPdfContent from "./QuotationPdfContent";
import { PrintStyles } from "./PrintStyles";
import { useQuotationPdf } from "@/hooks/useQuotationPdf";

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
    handleClientSelect,
    handleSubmit: submitHandler,
    handleConvertToOrder: convertHandler,
    isSubmitting,
  } = useQuotationForm(initialData);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [logo, setLogo] = useState(formData.logo || "");

  // Usar nosso novo hook de PDF
  const { isGenerating, handleShare, handleDownload, handlePrint } = useQuotationPdf(formData);

  useEffect(() => {
    // Update logo in form data when it changes
    updateField("logo", logo);
  }, [logo]);

  // Buscar o cliente selecionado quando o ID mudar
  useEffect(() => {
    if (formData.clientId) {
      const client = clients.find(c => c.id === formData.clientId);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [formData.clientId, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitHandler(e);
  };
  
  const handleConvertToOrder = () => {
    convertHandler();
  };

  const handleExportPDF = () => {
    handleDownload();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
        <div className="bg-background dark:bg-background/80 rounded-lg shadow-sm p-4 mb-4">
          <LogoUpload logo={logo} setLogo={setLogo} />
          
          <div className="mt-4">
            <ClientSection 
              clientId={formData.clientId}
              clients={clients}
              onClientChange={handleClientSelect}
            />
          </div>
        </div>
        
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
          calculateCubicMeasurement={() => {
            // Calculando localmente para não depender da função no hook
            return (formData.length * formData.width * formData.height) / 1000000;
          }}
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
          onExportPDF={handleExportPDF}
          isSubmitting={isSubmitting}
        />
      </form>
      
      {/* Conteúdo do PDF (escondido) */}
      <div className="hidden">
        <PrintStyles />
        <div id="quotation-pdf-content" ref={pdfRef}>
          <QuotationPdfContent 
            quotation={formData} 
            client={selectedClient} 
          />
        </div>
      </div>
    </>
  );
};

export default QuotationForm;
