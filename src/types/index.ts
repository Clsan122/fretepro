export interface CollectionOrder {
  id: string;
  orderNumber: string; // Added this field for auto-numbering
  sender: string;
  senderAddress: string;
  senderCnpj?: string;  // Added for company details
  senderCity?: string;  // Added for company details
  senderState?: string; // Added for company details
  recipient: string;
  recipientAddress: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  receiver: string;
  receiverAddress: string;
  volumes: number;
  weight: number;
  measurements: Measurement[];
  cubicMeasurement: number;
  merchandiseValue: number;
  invoiceNumber: string;
  observations: string;
  driverId?: string;
  driverName?: string;
  driverCpf?: string;
  licensePlate?: string;
  companyLogo: string;
  issuerId: string;
  createdAt: string;
  userId: string;
  shipper?: string;
  shipperAddress?: string;
  syncId?: string;
  syncVersion?: number;
  _deleted?: boolean;
  _synced?: boolean;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  cpf: string;
  phone: string;
  licensePlate: string;
  trailerPlate?: string;
  vehicleType: string;
  bodyType: string;
  address?: string;
  anttCode: string;
  vehicleYear: string;
  vehicleModel: string;
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city: string;
  state: string;
  zipCode?: string;
  cnpj?: string;
  cpf?: string;
  logo?: string;
  personType: 'physical' | 'legal';
  createdAt: string;
}

export interface Measurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  cpf?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  pixKey?: string;
  bankInfo: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  password?: string; // Add password as an optional property for registration
}

export interface Freight {
  id: string;
  userId: string;
  clientId: string;
  driverId?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  distance: number;
  price: number;
  totalValue: number;
  cargoType: string;
  cargoWeight?: number;
  cargoDescription?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentDate?: string;
  paymentMethod?: string;
  paymentProof?: string;
  deliveryProof?: string;
  expenses: FreightExpense[];
  observations?: string;
  createdAt: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  
  // Additional properties needed by FreightForm.tsx and other components
  departureDate?: string;
  arrivalDate?: string;
  volumes?: number;
  weight?: number;
  dimensions?: string;
  cubicMeasurement?: number;
  vehicleType?: string;
  freightValue: number;
  dailyRate: number;
  otherCosts: number;
  tollCosts: number;
  proofOfDeliveryImage?: string;
  pixKey?: string;
  paymentTerm?: string;
  thirdPartyDriverCost?: number;
  tollExpenses?: number;
  fuelExpenses?: number;
  mealExpenses?: number;
  helperExpenses?: number;
  accommodationExpenses?: number;
  totalExpenses?: number;
  netProfit?: number;
  clientName?: string; // Add clientName property for CollectionOrderView
  clientAddress?: string; // Add clientAddress property for CollectionOrderView
  requesterName?: string; // Add new property
}

export interface FreightExpense {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}
