
import { useQuotationFormState } from "./quotation/useQuotationFormState";
import { useQuotationClients } from "./quotation/useQuotationClients";
import { useQuotationDrivers } from "./quotation/useQuotationDrivers";
import { useQuotationCalculations } from "./quotation/useQuotationCalculations";

export interface QuotationFormData {
  // Dados do cliente
  clientId: string;
  
  // Localização
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  
  // Dados do Remetente/Expedidor/Destinatário
  sender: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderCnpj?: string;
  
  recipient: string;
  recipientAddress: string;
  
  shipper: string;
  shipperAddress: string;
  
  // Dados da carga
  volumes: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  merchandiseValue: number;
  
  // Dados adicionais
  observations: string;
  vehicleType: string;
  
  // Cotação
  quotedValue: number;
  
  // Motorista (opcional na cotação)
  driverId?: string;
}

export const useQuotationForm = (initialData?: Partial<QuotationFormData>) => {
  // Use the smaller hooks
  const { formData, updateField } = useQuotationFormState(initialData);
  const { clients, handleClientChange } = useQuotationClients();
  const { drivers } = useQuotationDrivers();
  const { calculateCubicMeasurement } = useQuotationCalculations();

  return {
    formData,
    clients,
    drivers,
    updateField,
    handleClientChange: (clientId: string) => handleClientChange(clientId, updateField),
    calculateCubicMeasurement: () => calculateCubicMeasurement(
      formData.length, 
      formData.width, 
      formData.height
    )
  };
};
