
import { User } from "@/types";
import { updateUser } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useProfileActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = (updatedUser: User) => {
    try {
      setIsSubmitting(true);
      
      // Garantir que dados da empresa sejam preservados
      const companyData = {
        companyName: updatedUser.companyName || "",
        cnpj: updatedUser.cnpj || "",
        companyLogo: updatedUser.companyLogo || "", 
      };
      
      // Garantir que dados pessoais sejam preservados
      const personalData = {
        name: updatedUser.name,
        email: updatedUser.email,
        cpf: updatedUser.cpf || "",
        phone: updatedUser.phone || "",
        avatar: updatedUser.avatar || "",
      };
      
      // Garantir que dados de endereço sejam preservados
      const addressData = {
        address: updatedUser.address || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
        zipCode: updatedUser.zipCode || "",
      };
      
      // Garantir que outros dados sejam preservados
      const otherData = {
        pixKey: updatedUser.pixKey || "",
        bankInfo: updatedUser.bankInfo || "",
      };
      
      const newUserData = {
        ...updatedUser,
        ...personalData,
        ...addressData,
        ...companyData,
        ...otherData,
      };

      // Atualiza o usuário no storage e no estado
      updateUser(newUserData);
      setUser(newUserData);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não conferem",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Em um ambiente real, aqui você faria uma chamada para sua API
    // para validar a senha atual e atualizar para a nova senha
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso",
    });
  };

  return {
    handleUpdateProfile,
    handleChangePassword,
    isSubmitting,
  };
};
