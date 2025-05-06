
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
        setProfileData({
          name: user.displayName || user.email?.split('@')[0] || 'Usuário',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          phone: user.phone || '',
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
