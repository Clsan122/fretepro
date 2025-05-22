
import { formatCurrency, formatCNPJ as formatCPFCNPJ, formatPhone } from "@/utils/formatters";

// Função auxiliar para traduzir o tipo de veículo
export const getVehicleTypeInPortuguese = (vehicleType: string): string => {
  const vehicleTypes: Record<string, string> = {
    "van": "Van de Carga",
    "utility": "Utilitário Pequeno",
    "truck_small": "Caminhão 3/4",
    "truck_medium": "Caminhão Toco",
    "truck_large": "Caminhão Truck",
    "truck_extra": "Caminhão Bitruck",
    "trailer": "Carreta Simples",
    "trailer_extended": "Carreta Estendida",
    "trailer_refrigerated": "Carreta Refrigerada"
  };
  
  return vehicleTypes[vehicleType] || vehicleType;
};

// Função auxiliar para traduzir o tipo de carga
export const getCargoTypeInPortuguese = (cargoType: string): string => {
  const cargoTypes: Record<string, string> = {
    "general": "Carga Geral",
    "fragile": "Carga Frágil",
    "perishable": "Perecíveis",
    "dangerous": "Carga Perigosa"
  };
  
  return cargoTypes[cargoType] || cargoType;
};

export type CreatorInfo = {
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
};

export type ClientInfo = {
  name: string;
  company?: string;
  city: string;
  state: string;
  document?: string;
  email?: string;
  phone?: string;
};
