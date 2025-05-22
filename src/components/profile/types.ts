
import { User } from "@/types";

export interface ProfileData {
  id: string;
  full_name: string | null;
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
  user: User;
  onUpdateProfile: (updatedData: any) => void;
}

export interface PersonalInfoCardProps {
  user: User | null;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  avatar: string;
  pixKey: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setCpf: (cpf: string) => void;
  setPhone: (phone: string) => void;
  setAvatar: (avatar: string) => void;
  setPixKey: (pixKey: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleAvatarUpload?: (file: File) => Promise<string | null>;
  isUpdating?: boolean;
  isUploading?: boolean;
}

export interface AddressCardProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  companyName: string;
  cnpj: string;
  companyLogo: string;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setZipCode: (zipCode: string) => void;
  setCompanyName: (companyName: string) => void;
  setCnpj: (cnpj: string) => void;
  setCompanyLogo: (companyLogo: string) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  handleCompanyLogoUpload?: (file: File) => Promise<string | null>;
  isUpdating?: boolean;
  isUploading?: boolean;
}
