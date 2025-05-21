
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { updateUser } from "@/utils/storage";

export const useProfileActions = (setUser: (user: any) => void) => {
  const { toast } = useToast();

  const handleUpdateProfile = async (updatedUser: any) => {
    try {
      // Update the user in storage
      updateUser(updatedUser);
      
      // Update the current user
      setUser(updatedUser);
      
      // If using Supabase, update the profile
      if (supabase) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: updatedUser.id,
            full_name: updatedUser.name,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            state: updatedUser.state,
            zip_code: updatedUser.zipCode,
            cpf: updatedUser.cpf,
            pix_key: updatedUser.pixKey,
            avatar_url: updatedUser.avatar
            // Removido o campo updated_at que estava causando o erro
          });
          
        if (error) {
          console.error("Error updating profile in Supabase:", error);
          toast({
            title: "Erro ao atualizar perfil",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive"
      });
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "A nova senha e a confirmação não coincidem.",
        variant: "destructive"
      });
      return;
    }

    try {
      // If using Supabase, update password
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          console.error("Error updating password in Supabase:", error);
          toast({
            title: "Erro ao alterar senha",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso."
      });

      // Clear password fields
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao alterar sua senha.",
        variant: "destructive"
      });
    }
  };

  return {
    handleUpdateProfile,
    handleChangePassword
  };
};
