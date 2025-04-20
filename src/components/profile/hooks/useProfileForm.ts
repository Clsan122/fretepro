import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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
  const [licensePlate, setLicensePlate] = useState("");
  const [trailerPlate, setTrailerPlate] = useState("");
  const [anttCode, setAnttCode] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [bodyType, setBodyType] = useState("");

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

      const fetchTruckInfo = async () => {
        const { data, error } = await supabase
          .from('truck_loving_info')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setLicensePlate(data.license_plate || '');
          setTrailerPlate(data.trailer_plate || '');
          setAnttCode(data.antt_code || '');
          setVehicleYear(data.vehicle_year || '');
          setVehicleModel(data.vehicle_model || '');
          setVehicleType(data.vehicle_type || '');
          setBodyType(data.body_type || '');
        }
      };

      fetchTruckInfo();
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
      confirmPassword,
      licensePlate,
      trailerPlate,
      anttCode,
      vehicleYear,
      vehicleModel,
      vehicleType,
      bodyType
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
      setLicensePlate,
      setTrailerPlate,
      setAnttCode,
      setVehicleYear,
      setVehicleModel,
      setVehicleType,
      setBodyType
    }
  };
};
