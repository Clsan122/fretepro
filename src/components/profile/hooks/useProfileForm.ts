
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
  
  // Address Information
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [zipCode, setZipCode] = useState(user?.zipCode || "");
  
  // Driver and Vehicle Information
  const [isDriver, setIsDriver] = useState(user?.isDriver || false);
  const [licensePlate, setLicensePlate] = useState(user?.licensePlate || "");
  const [trailerPlate, setTrailerPlate] = useState(user?.trailerPlate || "");
  const [vehicleType, setVehicleType] = useState(user?.vehicleType || "");
  const [bodyType, setBodyType] = useState(user?.bodyType || "");
  const [anttCode, setAnttCode] = useState(user?.anttCode || "");
  const [vehicleYear, setVehicleYear] = useState(user?.vehicleYear || "");
  const [vehicleModel, setVehicleModel] = useState(user?.vehicleModel || "");
  
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
      setAddress(updatedUser.address || "");
      setCity(updatedUser.city || "");
      setState(updatedUser.state || "");
      setZipCode(updatedUser.zipCode || "");
      setIsDriver(updatedUser.isDriver || false);
      setLicensePlate(updatedUser.licensePlate || "");
      setTrailerPlate(updatedUser.trailerPlate || "");
      setVehicleType(updatedUser.vehicleType || "");
      setBodyType(updatedUser.bodyType || "");
      setAnttCode(updatedUser.anttCode || "");
      setVehicleYear(updatedUser.vehicleYear || "");
      setVehicleModel(updatedUser.vehicleModel || "");
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
      address,
      city,
      state,
      zipCode,
      isDriver,
      licensePlate,
      trailerPlate,
      vehicleType,
      bodyType,
      anttCode,
      vehicleYear,
      vehicleModel,
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
      setIsDriver,
      setLicensePlate,
      setTrailerPlate,
      setVehicleType,
      setBodyType,
      setAnttCode,
      setVehicleYear,
      setVehicleModel,
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
    },
    resetForm
  };
};
