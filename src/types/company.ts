import { CompanyStatus, SubscriptionPlanType } from './roles';

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  registration_document_url: string | null;
  license_document_url: string | null;
  additional_docs_urls: any;
  status: CompanyStatus;
  approval_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  subscription_plan: SubscriptionPlanType | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  trial_ends_at: string | null;
  monthly_freight_limit: number | null;
  user_limit: number | null;
  logo_url: string | null;
  primary_color: string | null;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface CompanyRegistrationData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  representative_name: string;
  representative_cpf: string;
  representative_email: string;
  representative_phone: string;
  representative_role: string;
  registration_document?: File;
  license_document?: File;
  additional_documents?: File[];
}
