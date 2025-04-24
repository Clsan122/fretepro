
export interface CollectionOrder {
  id: string;
  orderNumber: string;
  
  // Sender information
  sender: string;
  senderAddress: string;
  senderCity?: string;
  senderState?: string;
  
  // Recipient information
  recipient: string;
  recipientAddress: string;
  recipientCity?: string;
  recipientState?: string;
  
  // Legacy fields for backward compatibility
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  
  // Shipper information (Local de Coleta)
  shipper?: string;
  shipperAddress?: string;
  shipperCity?: string;
  shipperState?: string;
  
  // Receiver information (Local de Entrega)
  receiver: string;
  receiverAddress: string;
  receiverCity?: string;
  receiverState?: string;
  
  // Cargo details
  volumes: number;
  weight: number;
  measurements: Measurement[];
  cubicMeasurement: number;
  merchandiseValue: number;
  
  // Additional details
  invoiceNumber: string;
  observations: string;
  
  // Driver information
  driverId?: string;
  driverName?: string;
  driverCpf?: string;
  licensePlate?: string;
  
  // System fields
  companyLogo?: string;
  issuerId: string;
  createdAt: string;
  userId: string;
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
  companyName?: string;
  cnpj?: string;
  companyLogo?: string;
  pixKey?: string;
  bankInfo: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  password?: string;
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
  
  // Additional properties for expanded freight fields
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
  clientName?: string;
  clientAddress?: string;
  
  // Additional location details (matching collection order)
  senderCity?: string;
  senderState?: string;
  senderAddress?: string;
  recipientCity?: string;
  recipientState?: string;
  recipientAddress?: string;
  shipperCity?: string;
  shipperState?: string;
  shipperAddress?: string;
  receiverCity?: string;
  receiverState?: string;
  receiverAddress?: string;
}

export interface FreightExpense {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}
