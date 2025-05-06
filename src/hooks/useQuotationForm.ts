
import { useState, useEffect } from "react";
import { Client, Driver } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId, getDriversByUserId } from "@/utils/storage";

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
  const { user } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [formData, setFormData] = useState<QuotationFormData>({
    clientId: initialData?.clientId || "",
    
    originCity: initialData?.originCity || "",
    originState: initialData?.originState || "",
    destinationCity: initialData?.destinationCity || "",
    destinationState: initialData?.destinationState || "",
    
    sender: initialData?.sender || "",
    senderAddress: initialData?.senderAddress || "",
    senderCity: initialData?.senderCity || "",
    senderState: initialData?.senderState || "",
    senderCnpj: initialData?.senderCnpj || "",
    
    recipient: initialData?.recipient || "",
    recipientAddress: initialData?.recipientAddress || "",
    
    shipper: initialData?.shipper || "",
    shipperAddress: initialData?.shipperAddress || "",
    
    volumes: initialData?.volumes || 0,
    weight: initialData?.weight || 0,
    length: initialData?.length || 0,
    width: initialData?.width || 0,
    height: initialData?.height || 0,
    merchandiseValue: initialData?.merchandiseValue || 0,
    
    observations: initialData?.observations || "",
    vehicleType: initialData?.vehicleType || "",
    
    quotedValue: initialData?.quotedValue || 0,
    
    driverId: initialData?.driverId || undefined
  });

  // Carregar clientes e motoristas
  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
      
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      
      // Se for usuário logado e nenhum remetente definido, usar dados do usuário
      if (!initialData?.sender && user.companyName) {
        setFormData(prev => ({
          ...prev,
          sender: user.companyName || '',
          senderAddress: user.address || '',
          senderCity: user.city || '',
          senderState: user.state || '',
          senderCnpj: user.cnpj || ''
        }));
      }
    }
  }, [user, initialData]);

  // Handle para mudança de cliente selecionado
  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clientId
    }));
    
    // Encontrar dados do cliente
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        recipient: selectedClient.name,
        recipientAddress: selectedClient.address || '',
      }));
    }
  };

  // Função para atualizar qualquer campo do formulário
  const updateField = (field: keyof QuotationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular a cubagem
  const calculateCubicMeasurement = () => {
    const cubicMeasurement = (formData.length * formData.width * formData.height) / 1000000;
    return cubicMeasurement;
  };

  return {
    formData,
    clients,
    drivers,
    updateField,
    handleClientChange,
    calculateCubicMeasurement
  };
};
