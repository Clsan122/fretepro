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
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cnpj: string;
  logo: string;
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
  bankInfo?: string; // Changed from {} to string
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}
