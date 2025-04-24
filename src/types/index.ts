
export interface CollectionOrder {
  id: string;
  sender: string;
  senderAddress: string;
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
}

export interface FreightExpense {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
}
