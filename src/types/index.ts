export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  role?: 'user' | 'admin';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  cpf?: string;
  companyName?: string;
  cnpj?: string;
  pixKey?: string;
  bankInfo?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  state: string;
  city: string;
  createdAt: string;
  userId: string;
  cnpj?: string;
  address?: string;
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
  address?: string;
  phone?: string;
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
  pixKey?: string;
  paymentTerm?: PaymentTerm;
  driverId?: string;
  
  // New expense fields
  thirdPartyDriverCost?: number;
  tollExpenses?: number;
  fuelExpenses?: number;
  mealExpenses?: number;
  helperExpenses?: number;
  accommodationExpenses?: number;
  totalExpenses?: number; // Sum of all expenses
  netProfit?: number; // Difference between totalValue and totalExpenses
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
  senderAddress?: string;       // Endereço do remetente
  recipient: string;            // Destinatário/importador
  recipientAddress?: string;    // Endereço do destinatário
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
  invoiceNumber?: string;       // Número da NF/Pedido
  observations?: string;        // Observações
  driverId?: string;            // ID do motorista
  driverName?: string;          // Nome do motorista (para exibição)
  driverCpf?: string;           // CPF do motorista (para exibição)
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
