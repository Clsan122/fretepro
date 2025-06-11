
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

export const useProfileActions = (setUser: (user: User) => void) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async (updatedUser: User) => {
    setIsUpdating(true);
    try {
      console.log('Atualizando perfil com dados:', updatedUser);
      
      // Atualizar o perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: updatedUser.id,
          full_name: updatedUser.name,
          phone: updatedUser.phone,
          cpf: updatedUser.cpf,
          address: updatedUser.address,
          city: updatedUser.city,
          state: updatedUser.state,
          zip_code: updatedUser.zipCode,
          pix_key: updatedUser.pixKey,
          avatar_url: updatedUser.avatar,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        throw profileError;
      }

      // Se for motorista, atualizar dados na tabela drivers
      if (updatedUser.isDriver && updatedUser.licensePlate) {
        const { error: driverError } = await supabase
          .from('drivers')
          .upsert({
            user_id: updatedUser.id,
            name: updatedUser.name,
            cpf: updatedUser.cpf,
            phone: updatedUser.phone,
            address: updatedUser.address,
            license_plate: updatedUser.licensePlate,
            trailer_plate: updatedUser.trailerPlate,
            vehicle_type: updatedUser.vehicleType,
            body_type: updatedUser.bodyType,
            antt_code: updatedUser.anttCode,
            vehicle_year: updatedUser.vehicleYear,
            vehicle_model: updatedUser.vehicleModel,
            updated_at: new Date().toISOString()
          });

        if (driverError) {
          console.error('Erro ao atualizar dados de motorista:', driverError);
          throw driverError;
        }
      }

      console.log('Perfil atualizado com sucesso');

      // Atualizar o estado local
      setUser(updatedUser);

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('Fazendo upload do avatar:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded com sucesso:', data.publicUrl);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUpdating,
    isChangingPassword,
    isUploading,
    handleUpdateProfile,
    handleChangePassword,
    handleAvatarUpload,
  };
};
