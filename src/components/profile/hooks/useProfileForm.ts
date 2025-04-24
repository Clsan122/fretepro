
import { useState, useEffect } from "react";
import { User } from "@/types";

export const useProfileForm = (user: User | null) => {
  // Dados pessoais
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [pixKey, setPixKey] = useState(user?.pixKey || "");

  // Dados de endereço
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [zipCode, setZipCode] = useState(user?.zipCode || "");

  // Dados da empresa
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [cnpj, setCnpj] = useState(user?.cnpj || "");
  const [companyLogo, setCompanyLogo] = useState(user?.companyLogo || "");

  // Dados de segurança
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Atualiza o estado quando o usuário mudar
  useEffect(() => {
    if (user) {
      // Dados pessoais
      setName(user.name);
      setEmail(user.email);
      setCpf(user.cpf || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
      setPixKey(user.pixKey || "");

      // Dados de endereço
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZipCode(user.zipCode || "");

      // Dados da empresa
      setCompanyName(user.companyName || "");
      setCnpj(user.cnpj || "");
      setCompanyLogo(user.companyLogo || "");
    }
  }, [user]);

  return {
    formData: {
      name,
      email,
      cpf,
      phone,
      avatar,
      pixKey,
      address,
      city,
      state,
      zipCode,
      companyName,
      cnpj,
      companyLogo,
      currentPassword,
      newPassword,
      confirmPassword,
    },
    setters: {
      setName,
      setEmail,
      setCpf,
      setPhone,
      setAvatar,
      setPixKey,
      setAddress,
      setCity,
      setState,
      setZipCode,
      setCompanyName,
      setCnpj,
      setCompanyLogo,
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    },
  };
};
