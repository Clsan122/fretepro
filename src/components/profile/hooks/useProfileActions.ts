
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/utils/storage";

const supabaseWithProfiles = supabase as unknown as {
  from(table: 'profiles'): {
    upsert: (data: ProfileData, options: { onConflict: string }) => Promise<{ error: any }>;
  }
};

export const useProfileActions = (setUser: (user: any) => void) => {
  const { toast } = useToast();

  const handleUpdateProfile = async (userData: any) => {
    try {
      if (!userData.id) return;

      const profileData: ProfileData = {
        id: userData.id,
        full_name: userData.name,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zipCode,
        cpf: userData.cpf,
        company_name: userData.companyName,
        cnpj: userData.cnpj,
        pix_key: userData.pixKey,
        avatar_url: userData.avatar,
        company_logo: userData.companyLogo
      };

      const { error } = await supabaseWithProfiles
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });
        
      if (error) throw error;
      
      updateUser(userData);
      setUser(userData);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem!",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) throw error;
        
        toast({
          title: "Senha alterada",
          description: "Sua senha foi alterada com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    handleUpdateProfile,
    handleChangePassword,
  };
};
