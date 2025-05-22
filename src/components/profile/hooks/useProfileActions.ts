
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { updateUser } from "@/utils/storage";
import { User } from "@/types";

export const useProfileActions = (setUser: (user: User) => void) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateProfile = async (updatedUser: User) => {
    try {
      setIsUpdating(true);
      
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
            avatar_url: updatedUser.avatar,
            company_name: updatedUser.companyName,
            cnpj: updatedUser.cnpj,
            company_logo: updatedUser.companyLogo,
            bank_info: updatedUser.bankInfo,
            updated_at: new Date().toISOString() // Use updated_at instead of modified_at
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "A nova senha e a confirmação não coincidem.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsChangingPassword(true);
      
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
          return false;
        }
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso."
      });

      // Clear password fields
      return true;
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao alterar sua senha.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      if (supabase) {
        const fileName = `avatar-${Date.now()}-${file.name}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(`public/${fileName}`, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) {
          console.error("Error uploading avatar:", error);
          toast({
            title: "Erro ao fazer upload",
            description: error.message,
            variant: "destructive"
          });
          return null;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(`public/${fileName}`);
          
        toast({
          title: "Upload concluído",
          description: "Sua foto foi atualizada com sucesso."
        });
        
        return publicUrl;
      } else {
        // Se não tiver Supabase, usar FileReader para preview local
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
            toast({
              title: "Upload concluído",
              description: "Sua foto foi atualizada localmente."
            });
          };
          reader.readAsDataURL(file);
        });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao enviar sua foto.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompanyLogoUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      if (supabase) {
        const fileName = `company-logo-${Date.now()}-${file.name}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('company-logos')
          .upload(`public/${fileName}`, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) {
          console.error("Error uploading company logo:", error);
          toast({
            title: "Erro ao fazer upload",
            description: error.message,
            variant: "destructive"
          });
          return null;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(`public/${fileName}`);
          
        toast({
          title: "Upload concluído",
          description: "O logo da empresa foi atualizado com sucesso."
        });
        
        return publicUrl;
      } else {
        // Se não tiver Supabase, usar FileReader para preview local
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
            toast({
              title: "Upload concluído",
              description: "O logo da empresa foi atualizado localmente."
            });
          };
          reader.readAsDataURL(file);
        });
      }
    } catch (error: any) {
      console.error("Error uploading company logo:", error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao enviar o logo da empresa.",
        variant: "destructive"
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
    handleCompanyLogoUpload
  };
};
