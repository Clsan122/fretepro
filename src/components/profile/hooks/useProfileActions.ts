import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/utils/storage";

// Cast the supabase client to include the profiles table
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

    // Update truck information
    try {
      const { error: truckError } = await supabase
        .from('truck_loving_info')
        .upsert({
          user_id: userData.id,
          license_plate: userData.licensePlate,
          trailer_plate: userData.trailerPlate,
          antt_code: userData.anttCode,
          vehicle_year: userData.vehicleYear,
          vehicle_model: userData.vehicleModel,
          vehicle_type: userData.vehicleType,
          body_type: userData.bodyType,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (truckError) throw truckError;
    } catch (error: any) {
      console.error("Error updating truck info:", error);
      toast({
        title: "Erro ao atualizar informações do veículo",
        description: error.message || "Não foi possível atualizar as informações do veículo.",
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
