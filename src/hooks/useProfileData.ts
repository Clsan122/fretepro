
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  cnpj?: string;
  cpf?: string;
  phone?: string;
}

interface UserWithCustomProperties {
  id?: string;
  email?: string | null;
  name?: string;
  displayName?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [companyData, setCompanyData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      
      // Simulando carregamento de dados do perfil
      // Em uma implementação real, isso seria uma chamada API
      setTimeout(() => {
        const userWithCustomProps = user as unknown as UserWithCustomProperties;
        
        setProfileData({
          name: userWithCustomProps.name || 
                userWithCustomProps.displayName || 
                userWithCustomProps.email?.split('@')[0] || 
                'Usuário',
          address: userWithCustomProps.address || '',
          city: userWithCustomProps.city || '',
          state: userWithCustomProps.state || '',
          phone: userWithCustomProps.phone || '',
        });
        
        setCompanyData({
          name: "Minha Empresa",
          address: "Endereço da Empresa, 123",
          city: "São Paulo",
          state: "SP",
          cnpj: "00.000.000/0001-00",
          phone: "(11) 9999-9999",
        });
        
        setIsLoading(false);
      }, 500);
    }
  }, [user]);

  return {
    profileData,
    companyData,
    isLoading
  };
};
