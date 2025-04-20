
export interface ProfileData {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  cpf: string | null;
  company_name: string | null;
  cnpj: string | null;
  pix_key: string | null;
  avatar_url: string | null;
  company_logo: string | null;
}

export interface ProfileFormProps {
  user: any;
  onUpdateProfile: (updatedData: any) => void;
}
