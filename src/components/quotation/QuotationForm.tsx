
import React, { useState, useEffect, useRef } from "react";
import { useQuotationForm, QuotationFormData } from "@/hooks/useQuotationForm";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateOrderNumber } from "@/utils/orderNumber";
import { CollectionOrder, Measurement } from "@/types";
import { LogoUpload } from "@/components/client/LogoUpload";
import { PDFExport } from "@progress/kendo-react-pdf";

// Import our component sections
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
    handleClientSelect,
    handleSubmit: submitHandler,
    handleConvertToOrder: convertHandler,
    handleExportPDF: exportPDFHandler,
    isSubmitting,
  } = useQuotationForm(initialData);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const pdfExportComponent = useRef<PDFExport>(null);
  
  const [logo, setLogo] = useState(formData.logo || "");

  useEffect(() => {
    // Update logo in form data when it changes
    updateField("logo", logo);
  }, [logo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitHandler(e);
  };
  
  const handleConvertToOrder = () => {
    convertHandler();
  };

  const handleExportPDF = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
      toast({
        title: "PDF gerado",
        description: "O PDF da cotação foi gerado com sucesso",
      });
    }
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
      
      {/* PDF Preview (hidden) */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <PDFExport ref={pdfExportComponent} paperSize="A4" fileName={`cotacao-${new Date().toISOString().split('T')[0]}.pdf`}>
          <div style={{ padding: "30px" }}>
            {logo && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img 
                  src={logo}
                  alt="Logo"
                  style={{ maxHeight: "80px", maxWidth: "200px", margin: "0 auto" }}
                />
              </div>
            )}
            
            <h1 style={{ fontSize: "24px", textAlign: "center", marginBottom: "20px" }}>Cotação de Frete</h1>
            
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Informações do Cliente</h2>
              <p><strong>Cliente:</strong> {clients.find(c => c.id === formData.clientId)?.name || "N/A"}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Remetente e Destinatário</h2>
              <p><strong>Remetente:</strong> {formData.sender}</p>
              <p><strong>Endereço:</strong> {formData.senderAddress}</p>
              <p><strong>CNPJ:</strong> {formData.senderCnpj}</p>
              <p><strong>Cidade/UF:</strong> {formData.senderCity}/{formData.senderState}</p>
              <p><strong>Destinatário:</strong> {formData.recipient}</p>
              <p><strong>Endereço:</strong> {formData.recipientAddress}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Localização</h2>
              <p><strong>Origem:</strong> {formData.originCity}/{formData.originState}</p>
              <p><strong>Destino:</strong> {formData.destinationCity}/{formData.destinationState}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Informações da Carga</h2>
              <p><strong>Volumes:</strong> {formData.volumes}</p>
              <p><strong>Peso:</strong> {formData.weight} kg</p>
              <p><strong>Dimensões:</strong> {formData.length}x{formData.width}x{formData.height} m</p>
              <p><strong>Cubagem:</strong> {(formData.length * formData.width * formData.height) / 1000000} m³</p>
              <p><strong>Valor da Mercadoria:</strong> R$ {formData.merchandiseValue.toFixed(2)}</p>
              <p><strong>Tipo de Veículo:</strong> {formData.vehicleType || "N/A"}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Valores</h2>
              <p><strong>Valor do Frete:</strong> R$ {formData.quotedValue.toFixed(2)}</p>
              <p><strong>Pedágio:</strong> R$ {formData.toll.toFixed(2)}</p>
              <p><strong>Seguro:</strong> R$ {formData.insurance.toFixed(2)}</p>
              <p><strong>Outros:</strong> R$ {formData.others.toFixed(2)}</p>
              <p><strong>Valor Total:</strong> R$ {formData.totalValue.toFixed(2)}</p>
            </div>
            
            {formData.observations && (
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Observações</h2>
                <p>{formData.observations}</p>
              </div>
            )}
            
            <div style={{ marginTop: "50px", borderTop: "1px solid #ccc", paddingTop: "20px", fontSize: "12px", textAlign: "center" }}>
              <p>Cotação gerada em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
        </PDFExport>
      </div>
    </>
  );
};

export default QuotationForm;
