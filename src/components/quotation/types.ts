
export interface QuotationMeasurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}

export interface QuotationData {
  id: string;
  orderNumber?: string;
  creatorId: string;
  creatorName: string;
  creatorLogo?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  volumes: number;
  weight: number;
  measurements: QuotationMeasurement[];
  cargoType: string;
  merchandiseValue: number;
  vehicleType: string;
  freightValue: number;
  tollValue: number;
  insuranceValue: number;
  insuranceRate: number;
  otherCosts: number;
  totalValue: number;
  notes?: string;
  createdAt: string;
  userId: string;
  status: "open" | "closed";
}
