
import { useState, useEffect } from "react";
import { Driver } from "@/types";
import { formatBrazilianPhone, formatCPF } from "@/utils/formatters";

export const useDriverForm = (driverToEdit?: Driver) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [trailerPlate, setTrailerPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [anttCode, setAnttCode] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  useEffect(() => {
    if (driverToEdit) {
      setName(driverToEdit.name);
      setCpf(driverToEdit.cpf);
      setPhone(driverToEdit.phone);
      setAddress(driverToEdit.address || "");
      setLicensePlate(driverToEdit.licensePlate);
      setTrailerPlate(driverToEdit.trailerPlate || "");
      setVehicleType(driverToEdit.vehicleType);
      setBodyType(driverToEdit.bodyType);
      setAnttCode(driverToEdit.anttCode);
      setVehicleYear(driverToEdit.vehicleYear);
      setVehicleModel(driverToEdit.vehicleModel);
    }
  }, [driverToEdit]);

  const formatLicensePlate = (value: string) => {
    const plateText = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (plateText.length <= 3) return plateText;
    if (plateText.length > 3) return `${plateText.slice(0, 3)}-${plateText.slice(3, 7)}`;
    return plateText;
  };

  const handleLicensePlateChange = (value: string) => {
    setLicensePlate(formatLicensePlate(value));
  };

  const handleTrailerPlateChange = (value: string) => {
    setTrailerPlate(formatLicensePlate(value));
  };

  const handleCPFChange = (value: string) => {
    const cpfValue = value.replace(/\D/g, '');
    setCpf(cpfValue);
  };

  const handlePhoneChange = (value: string) => {
    const phoneValue = value.replace(/\D/g, '');
    setPhone(phoneValue);
  };

  return {
    formData: {
      name,
      cpf,
      phone,
      address,
      licensePlate,
      trailerPlate,
      vehicleType,
      bodyType,
      anttCode,
      vehicleYear,
      vehicleModel,
    },
    handlers: {
      setName,
      handleCPFChange,
      handlePhoneChange,
      setAddress,
      handleLicensePlateChange,
      handleTrailerPlateChange,
      setVehicleType,
      setBodyType,
      setAnttCode,
      setVehicleYear,
      setVehicleModel,
    },
  };
};
