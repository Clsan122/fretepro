
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
          company_name: updatedUser.companyName,
          cnpj: updatedUser.cnpj,
          pix_key: updatedUser.pixKey,
          avatar_url: updatedUser.avatar,
          company_logo: updatedUser.companyLogo,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        throw profileError;
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

  const handleCompanyLogoUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;

      console.log('Fazendo upload do logo da empresa:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload do logo:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      console.log('Logo da empresa uploaded com sucesso:', data.publicUrl);

      return data.publicUrl;
    } catch (error: any) {
      console.error("Erro ao fazer upload do logo:", error);
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
    handleCompanyLogoUpload,
  };
};
