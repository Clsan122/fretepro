
import { useState, useEffect } from 'react';
import { User } from '@/types';

export const useProfileForm = (user: User | null) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCpf(user.cpf || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZipCode(user.zipCode || "");
      setPhone(user.phone || "");
      setCompanyName(user.companyName || "");
      setCnpj(user.cnpj || "");
      setPixKey(user.pixKey || "");
      setAvatar(user.avatar || "");
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
      companyName,
      cnpj,
      companyLogo,
      address,
      city,
      state,
      zipCode,
      currentPassword,
      newPassword,
      confirmPassword
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
      setConfirmPassword
    }
  };
};
