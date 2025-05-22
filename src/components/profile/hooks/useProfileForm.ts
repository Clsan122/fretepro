
import { useState } from "react";
import { User } from "@/types";

export const useProfileForm = (user: User | null) => {
  // Personal Information
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [pixKey, setPixKey] = useState(user?.pixKey || "");
  
  // Company Information
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [cnpj, setCnpj] = useState(user?.cnpj || "");
  const [companyLogo, setCompanyLogo] = useState(user?.companyLogo || "");
  
  // Address Information
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [zipCode, setZipCode] = useState(user?.zipCode || "");
  
  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Reset form with new user data
  const resetForm = (updatedUser: User | null) => {
    if (updatedUser) {
      setName(updatedUser.name || "");
      setEmail(updatedUser.email || "");
      setCpf(updatedUser.cpf || "");
      setPhone(updatedUser.phone || "");
      setAvatar(updatedUser.avatar || "");
      setPixKey(updatedUser.pixKey || "");
      setCompanyName(updatedUser.companyName || "");
      setCnpj(updatedUser.cnpj || "");
      setCompanyLogo(updatedUser.companyLogo || "");
      setAddress(updatedUser.address || "");
      setCity(updatedUser.city || "");
      setState(updatedUser.state || "");
      setZipCode(updatedUser.zipCode || "");
    }
  };

  return {
    formData: {
      name,
      email,
      cpf,
      phone,
      avatar,
      pixKey,
      companyName,
      cnpj,
      companyLogo,
      address,
      city,
      state,
      zipCode,
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
      setCompanyName,
      setCnpj,
      setCompanyLogo,
      setAddress,
      setCity,
      setState,
      setZipCode,
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    },
    resetForm
  };
};
