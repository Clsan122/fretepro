
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

export interface CollectionOrder {
  id: string;
  sender: string;               // Remetente/exportador
  recipient: string;            // Destinatário/importador
  originCity: string;           // Cidade origem
  originState: string;          // Estado origem
  destinationCity: string;      // Cidade destino
  destinationState: string;     // Estado destino
  receiver: string;             // Recebedor/destinatário
  receiverAddress: string;      // Endereço do recebedor/destinatário
  volumes: number;              // Quantidade de volumes
  weight: number;               // Peso
  measurements: Measurement[];  // Medidas
  cubicMeasurement: number;     // Cubagem
  merchandiseValue: number;     // Valor da mercadoria
  driverId?: string;            // ID do motorista
  driverName?: string;          // Nome do motorista (para exibição)
  licensePlate?: string;        // Placa do veículo
  companyLogo?: string;         // Logo da empresa (base64)
  createdAt: string;            // Data de criação
  userId: string;               // ID do usuário que criou
}

export interface Measurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}
