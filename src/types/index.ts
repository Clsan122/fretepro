export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  cnpj?: string;
  companyLogo?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  cnpj?: string;
  logo?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  licensePlate?: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  model: string;
  licensePlate: string;
  type: string;
  capacity: number;
  createdAt: string;
}

export interface Freight {
  id: string;
  clientId: string;
  userId: string;
  driverId?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  departureDate: string;
  arrivalDate: string;
  distance: number;
  price: number;
  volumes: number;
  weight: number;
  dimensions: string;
  cubicMeasurement: number;
  cargoType: string;
  vehicleType: string;
  freightValue: number;
  dailyRate: number;
  otherCosts: number;
  tollCosts: number;
  totalValue: number;
  status: 'pending' | 'in transit' | 'delivered' | 'canceled';
  paymentStatus: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  expenses: Expense[];
}

export interface Expense {
  id: string;
  freightId: string;
  type: string;
  description: string;
  value: number;
  createdAt: string;
}

export interface Quotation {
  id: string;
  userId: string;
  clientId?: string;
  clientName?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  volumes: number;
  weight: number;
  dimensions: string;
  cubicMeasurement: number;
  cargoType: string;
  vehicleType: string;
  pricePerKm: number;
  tollCost: number;
  additionalCosts: number;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export interface CollectionOrder {
  id: string;
  userId: string;
  orderNumber: string;
  createdAt: string;
  
  // Transportadora
  sender: string;
  senderAddress: string;
  senderCnpj?: string;
  senderCity?: string;
  senderState?: string;
  senderLogo?: string; // Adicionando o logo da transportadora
  
  // Remetente
  shipper?: string;
  shipperAddress?: string;
  
  // Destinatário
  recipient: string;
  recipientAddress: string;
  
  // Recebedor
  receiver?: string;
  receiverAddress?: string;
  
  // Localização
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  
  // Carga
  volumes: number;
  weight: number;
  merchandiseValue: number;
  cubicMeasurement?: number;
  measurements?: CargoMeasurement[];
  
  // Informações adicionais
  driverId?: string;
  driverName?: string;
  driverCpf?: string;
  licensePlate?: string;
  invoiceNumber: string;
  observations?: string;
  companyLogo?: string;
  issuerId: string;
}

// Tipo adicionado para manter compatibilidade com o código existente
export interface CargoMeasurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}
