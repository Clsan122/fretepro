
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Client {
  id: string;
  name: string;
  state: string;
  city: string;
  createdAt: string;
  userId: string;
}

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  licensePlate: string;
  trailerPlate?: string;
  vehicleType: VehicleType;
  bodyType: BodyType;
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
  // Campos de pagamento
  pixKey?: string;
  paymentTerm?: PaymentTerm;
  // Novo campo para o motorista
  driverId?: string;
}

export type PaymentTerm = 
  | 'upfront' 
  | 'tenDays'
  | 'fifteenDays'
  | 'twentyDays'
  | 'thirtyDays'
  | 'custom';

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

export type BodyType =
  | 'open'
  | 'closed'
  | 'sider'
  | 'van'
  | 'utility';

export interface BrazilianState {
  name: string;
  abbreviation: string;
}
