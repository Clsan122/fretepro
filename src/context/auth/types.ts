
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  cpf?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  avatar?: string;
  pixKey?: string;
  
  // Driver/Vehicle Information
  isDriver?: boolean;
  licensePlate?: string;
  trailerPlate?: string;
  vehicleType?: string;
  bodyType?: string;
  anttCode?: string;
  vehicleYear?: string;
  vehicleModel?: string;
  
  // Profile metadata
  created_at?: string;
  updated_at?: string;
}
