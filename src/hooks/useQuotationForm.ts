
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuotationFormState } from "./quotation/useQuotationFormState";
import { useQuotationCalculations } from "./quotation/useQuotationCalculations";
import { useQuotationDrivers } from "./quotation/useQuotationDrivers";
import { useQuotationClients } from "./quotation/useQuotationClients";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface QuotationFormData {
  clientId: string;
  
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  
  sender: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderCnpj: string;
  
  recipient: string;
  recipientAddress: string;
  
  shipper: string;
  shipperAddress: string;
  
  volumes: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  merchandiseValue: number;
  
  observations: string;
  vehicleType: string;
  
  quotedValue: number;
  toll: number;
  insurance: number;
  insurancePercentage: number;
  others: number;
  totalValue: number;
  
  driverId: string | undefined;
  
  logo: string;
}

export const useQuotationForm = (initialData?: Partial<QuotationFormData>) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state management
  const { formData, updateField } = useQuotationFormState(initialData);
  
  // Additional hooks for quotation functionality
  const { clients, selectedClient, setSelectedClient } = useQuotationClients(formData.clientId);
  const { drivers } = useQuotationDrivers();
  const { updateCalculations } = useQuotationCalculations(formData, updateField);
  
  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    updateField("clientId", clientId);
    
    // Find the selected client
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId) {
      toast.error("Por favor, selecione um cliente");
      return;
    }
    
    if (!formData.originCity || !formData.originState || !formData.destinationCity || !formData.destinationState) {
      toast.error("Por favor, preencha as informações de origem e destino");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Save quotation logic would go here
      
      toast.success("Cotação salva com sucesso!");
      // Navigate to quotations list or another page
      
    } catch (error) {
      console.error("Error saving quotation:", error);
      toast.error("Erro ao salvar cotação");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Convert to collection order
  const handleConvertToOrder = () => {
    try {
      // Navigate to collection order with quotation data
      navigate("/collection-order", { 
        state: { 
          quotationData: formData
        } 
      });
    } catch (error) {
      console.error("Error converting to order:", error);
      toast.error("Erro ao converter para ordem de coleta");
    }
  };
  
  // Export to PDF
  const handleExportPDF = () => {
    try {
      toast.info("Exportando PDF...");
      // PDF export logic would go here
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    }
  };
  
  return {
    formData,
    updateField,
    handleSubmit,
    isSubmitting,
    clients,
    selectedClient,
    handleClientSelect,
    drivers,
    handleConvertToOrder,
    handleExportPDF,
    updateCalculations
  };
};
