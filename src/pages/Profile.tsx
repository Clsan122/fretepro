
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin, Truck } from "lucide-react";
import AccountInfoCard from "@/components/profile/AccountInfoCard";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import PasswordCard from "@/components/profile/PasswordCard";
import AddressInfoCard from "@/components/profile/AddressInfoCard";
import DriverVehicleCard from "@/components/profile/DriverVehicleCard";
import { useProfileForm } from "@/components/profile/hooks/useProfileForm";
import { useProfileActions } from "@/components/profile/hooks/useProfileActions";

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { formData, setters, resetForm } = useProfileForm(user);
  const { 
    isUpdating, 
    isChangingPassword, 
    isUploading, 
    handleUpdateProfile, 
    handleChangePassword, 
    handleAvatarUpload
  } = useProfileActions(setUser);

  // Atualizar o formulário quando o usuário mudar
  useEffect(() => {
    resetForm(user);
  }, [user, resetForm]);

  if (!user) {
    return (
      <Layout>
        <div className="p-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <p>Você precisa estar logado para acessar esta página.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile({
      ...user,
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.phone,
      avatar: formData.avatar,
      pixKey: formData.pixKey,
    });
  };

  const handleAddressInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile({
      ...user,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    });
  };

  const handleDriverVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile({
      ...user,
      isDriver: formData.isDriver,
      licensePlate: formData.licensePlate,
      trailerPlate: formData.trailerPlate,
      vehicleType: formData.vehicleType,
      bodyType: formData.bodyType,
      anttCode: formData.anttCode,
      vehicleYear: formData.vehicleYear,
      vehicleModel: formData.vehicleModel,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = handleChangePassword(
      formData.currentPassword,
      formData.newPassword,
      formData.confirmPassword
    );
    
    if (success) {
      setters.setCurrentPassword("");
      setters.setNewPassword("");
      setters.setConfirmPassword("");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 md:px-4 max-w-full overflow-x-hidden">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Meu Perfil</h1>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Dados Pessoais</span>
              <span className="md:hidden">Pessoais</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Endereço</span>
              <span className="md:hidden">Endereço</span>
            </TabsTrigger>
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden md:inline">Motorista</span>
              <span className="md:hidden">Motorista</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Segurança</span>
              <span className="md:hidden">Segurança</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-6">
              <AccountInfoCard user={user} />
              <PersonalInfoCard
                user={user}
                name={formData.name}
                email={formData.email}
                cpf={formData.cpf}
                phone={formData.phone}
                avatar={formData.avatar}
                pixKey={formData.pixKey}
                setName={setters.setName}
                setEmail={setters.setEmail}
                setCpf={setters.setCpf}
                setPhone={setters.setPhone}
                setAvatar={setters.setAvatar}
                setPixKey={setters.setPixKey}
                onSubmit={handlePersonalInfoSubmit}
                handleAvatarUpload={handleAvatarUpload}
                isUpdating={isUpdating}
                isUploading={isUploading}
              />
            </div>
          </TabsContent>

          <TabsContent value="address">
            <AddressInfoCard
              address={formData.address}
              city={formData.city}
              state={formData.state}
              zipCode={formData.zipCode}
              setAddress={setters.setAddress}
              setCity={setters.setCity}
              setState={setters.setState}
              setZipCode={setters.setZipCode}
              onSubmit={handleAddressInfoSubmit}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="driver">
            <DriverVehicleCard
              isDriver={formData.isDriver}
              licensePlate={formData.licensePlate}
              trailerPlate={formData.trailerPlate}
              vehicleType={formData.vehicleType}
              bodyType={formData.bodyType}
              anttCode={formData.anttCode}
              vehicleYear={formData.vehicleYear}
              vehicleModel={formData.vehicleModel}
              setIsDriver={setters.setIsDriver}
              setLicensePlate={setters.setLicensePlate}
              setTrailerPlate={setters.setTrailerPlate}
              setVehicleType={setters.setVehicleType}
              setBodyType={setters.setBodyType}
              setAnttCode={setters.setAnttCode}
              setVehicleYear={setters.setVehicleYear}
              setVehicleModel={setters.setVehicleModel}
              onSubmit={handleDriverVehicleSubmit}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="security">
            <PasswordCard
              currentPassword={formData.currentPassword}
              newPassword={formData.newPassword}
              confirmPassword={formData.confirmPassword}
              setCurrentPassword={setters.setCurrentPassword}
              setNewPassword={setters.setNewPassword}
              setConfirmPassword={setters.setConfirmPassword}
              handleChangePassword={handlePasswordSubmit}
              isChangingPassword={isChangingPassword}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
