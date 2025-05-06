
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
  toll: number;
  insurance: number;
  insurancePercentage: number;
  others: number;
  totalValue: number;
  
  // Motorista (opcional na cotação)
  driverId?: string;
  
  // Logo da empresa (opcional)
  logo?: string;
}

export const useQuotationForm = (initialData?: Partial<QuotationFormData>) => {
  // Use the smaller hooks
  const { formData, updateField } = useQuotationFormState(initialData);
  const { clients, handleClientChange } = useQuotationClients();
  const { drivers } = useQuotationDrivers();
  const { calculateCubicMeasurement, calculateInsurance, calculateTotal } = useQuotationCalculations();

  // Calculate insurance when merchandise value or percentage changes
  const updateInsurance = () => {
    const insurance = calculateInsurance(formData.merchandiseValue, formData.insurancePercentage);
    updateField("insurance", insurance);
    updateTotal();
  };

  // Calculate total value
  const updateTotal = () => {
    const total = calculateTotal(
      formData.quotedValue,
      formData.toll,
      formData.insurance,
      formData.others
    );
    updateField("totalValue", total);
  };

  // Override updateField to handle special calculations
  const handleUpdateField = (field: keyof QuotationFormData, value: any) => {
    updateField(field, value);

    // Special case handlers
    if (field === "merchandiseValue" || field === "insurancePercentage") {
      // Calculate insurance when either value changes
      setTimeout(() => updateInsurance(), 0);
    }

    if (["quotedValue", "toll", "insurance", "others"].includes(field)) {
      // Update total when any price component changes
      setTimeout(() => updateTotal(), 0);
    }
  };

  return {
    formData,
    clients,
    drivers,
    updateField: handleUpdateField,
    handleClientChange: (clientId: string) => {
      handleClientChange(clientId, updateField);
    },
    calculateCubicMeasurement: () => calculateCubicMeasurement(
      formData.length, 
      formData.width, 
      formData.height
    ),
    updateInsurance,
    updateTotal
  };
};
