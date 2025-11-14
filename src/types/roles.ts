export type AppRole = 'superadmin' | 'company_admin' | 'company_user' | 'driver' | 'shipper';

export type CompanyStatus = 'pending_approval' | 'active' | 'suspended' | 'rejected' | 'canceled';

export type SubscriptionPlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export type FreightStatus = 'draft' | 'pending_approval' | 'open' | 'in_negotiation' | 'assigned' | 'in_transit' | 'completed' | 'canceled';

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  company_id: string | null;
  created_at: string;
  created_by: string | null;
}

export interface RoleCheck {
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isCompanyUser: boolean;
  isDriver: boolean;
  isShipper: boolean;
  role: AppRole | null;
  companyId: string | null;
}
