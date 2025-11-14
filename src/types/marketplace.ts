export interface MarketplaceFreight {
  id: string;
  company_id: string;
  posted_by: string;
  status: 'open' | 'in_negotiation' | 'assigned' | 'in_transit' | 'completed' | 'canceled';
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  cargo_type: string;
  cargo_description?: string;
  weight: number;
  volumes: number;
  vehicle_type: string;
  body_type?: string;
  pickup_date: string;
  delivery_deadline: string;
  distance: number;
  suggested_price: number;
  price_negotiable: boolean;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  special_requirements?: string;
  visibility: 'public' | 'private' | 'invited_only';
  expires_at: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface FreightBid {
  id: string;
  freight_id: string;
  driver_id: string;
  user_id: string;
  proposed_price: number;
  estimated_pickup_date: string;
  estimated_delivery_date: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  accepted_at?: string;
  accepted_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FreightAssignment {
  id: string;
  freight_id: string;
  bid_id?: string;
  driver_id: string;
  company_id: string;
  assigned_price: number;
  status: 'assigned' | 'in_transit' | 'completed' | 'canceled';
  pickup_proof?: string;
  delivery_proof?: string;
  started_at?: string;
  completed_at?: string;
  rating_driver?: number;
  rating_company?: number;
  driver_review?: string;
  company_review?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_freight' | 'new_bid' | 'bid_accepted' | 'bid_rejected' | 
        'freight_assigned' | 'freight_started' | 'freight_completed' |
        'payment_received' | 'new_rating' | 'system';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  read_at?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    max_freights_per_month: number;
    max_users: number;
    marketplace_access: boolean;
    api_access: boolean;
    whitelabel?: boolean;
  };
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DriverRating {
  id: string;
  driver_id: string;
  assignment_id: string;
  company_id: string;
  rated_by: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface CompanyRating {
  id: string;
  company_id: string;
  assignment_id: string;
  driver_id: string;
  rated_by: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface FreightTracking {
  id: string;
  assignment_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  status: string;
  notes?: string;
  created_at: string;
}

export interface Message {
  id: string;
  assignment_id: string;
  sender_id: string;
  message: string;
  read: boolean;
  read_at?: string;
  created_at: string;
}
