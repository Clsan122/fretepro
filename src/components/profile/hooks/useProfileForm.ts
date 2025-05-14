
import { useState } from "react";

export const useProfileForm = (user: any) => {
  // Personal Information
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [pixKey, setPixKey] = useState(user?.pixKey || "");
  
  // Address Information
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [zipCode, setZipCode] = useState(user?.zipCode || "");
  
  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    },
  };
};
