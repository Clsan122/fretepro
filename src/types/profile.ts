
// Define the Supabase profile type that includes our custom fields
export interface SupabaseProfile {
  id: string;
  avatar_url: string | null;
  created_at: string | null;
  full_name: string | null;
  phone: string | null;
  updated_at: string | null;
  user_type: string | null;
  cpf: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  company_name: string | null;
  cnpj: string | null;
  company_logo: string | null;
  pix_key: string | null;
}
