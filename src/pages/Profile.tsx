
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Import the refactored components
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import AddressCard from "@/components/profile/AddressCard";
import PasswordCard from "@/components/profile/PasswordCard";
import AccountInfoCard from "@/components/profile/AccountInfoCard";
import DebugInfo from "@/components/profile/DebugInfo";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Personal data fields
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  
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
      
      if (user.birthDate) {
        setBirthDate(new Date(user.birthDate));
      }
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de atualização do perfil (em um app real, isso chamaria uma API)
    const updatedUser = {
      ...user!,
      name,
      email,
      birthDate: birthDate ? birthDate.toISOString() : "",
      cpf,
      address,
      city,
      state,
      zipCode,
      phone
    };
    
    // Em um app real, você chamaria uma API para atualizar o usuário no banco de dados
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso!",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem!",
        variant: "destructive",
      });
      return;
    }
    
    // Em um app real, isso chamaria uma API para alterar a senha
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso!",
    });
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Add a debug message to check if the profile component is rendering
  console.log("Profile component rendering, user:", user);

  return (
    <Layout>
      {/* Debug information */}
      <DebugInfo user={user} />
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PersonalInfoCard 
            user={user}
            name={name}
            email={email}
            birthDate={birthDate}
            cpf={cpf}
            phone={phone}
            setName={setName}
            setEmail={setEmail}
            setBirthDate={setBirthDate}
            setCpf={setCpf}
            setPhone={setPhone}
            handleUpdateProfile={handleUpdateProfile}
          />

          <AddressCard 
            address={address}
            city={city}
            state={state}
            zipCode={zipCode}
            setAddress={setAddress}
            setCity={setCity}
            setState={setState}
            setZipCode={setZipCode}
            handleUpdateProfile={handleUpdateProfile}
          />
        </div>

        <PasswordCard 
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          handleChangePassword={handleChangePassword}
        />

        <AccountInfoCard user={user} />
      </div>
    </Layout>
  );
};

export default Profile;
