
export interface User {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  createdAt: string;
  cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

export interface Client {
  id: string;
  name: string;
  state: string;
  city: string;
  createdAt: string;
  userId: string;
}

export interface Freight {
  id: string;
  clientId: string;
  originCity: string;
  originState: string;
  departureDate: string;
  destinationCity: string;
  destinationState: string;
  arrivalDate: string;
  volumes: number;
  weight: number;
  dimensions: string;
  cubicMeasurement: number;
  cargoType: CargoType;
  vehicleType: VehicleType;
  freightValue: number;
  dailyRate: number;
  otherCosts: number;
  tollCosts: number;
  totalValue: number;
  proofOfDeliveryImage?: string;
  createdAt: string;
  userId: string;
}

export type CargoType = 
  | 'general'
  | 'dangerous'
  | 'liquid'
  | 'sackCargo'
  | 'drum'
  | 'pallet';

export type VehicleType = 
  | 'fiorino'
  | 'van'
  | 'vlc'
  | 'threeQuarter'
  | 'toco'
  | 'truck'
  | 'trailer';

export interface BrazilianState {
  name: string;
  abbreviation: string;
}
