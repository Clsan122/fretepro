
import React from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Building } from "lucide-react";
import AccountInfoCard from "@/components/profile/AccountInfoCard";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import PasswordCard from "@/components/profile/PasswordCard";
import AddressCard from "@/components/profile/AddressCard";
import { useProfileForm } from "@/components/profile/hooks/useProfileForm";
import { useProfileActions } from "@/components/profile/hooks/useProfileActions";

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { formData, setters } = useProfileForm(user);
  const { handleUpdateProfile, handleChangePassword } = useProfileActions(setUser);

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
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden md:inline">Empresa</span>
              <span className="md:hidden">Empresa</span>
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
                onSubmit={(e) => {
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
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="company">
            <div className="space-y-6">
              <AddressCard
                address={formData.address}
                city={formData.city}
                state={formData.state}
                zipCode={formData.zipCode}
                companyName={formData.companyName}
                cnpj={formData.cnpj}
                companyLogo={formData.companyLogo}
                setAddress={setters.setAddress}
                setCity={setters.setCity}
                setState={setters.setState}
                setZipCode={setters.setZipCode}
                setCompanyName={setters.setCompanyName}
                setCnpj={setters.setCnpj}
                setCompanyLogo={setters.setCompanyLogo}
                handleUpdateProfile={(e) => {
                  e.preventDefault();
                  handleUpdateProfile({
                    ...user,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    companyName: formData.companyName,
                    cnpj: formData.cnpj,
                    companyLogo: formData.companyLogo,
                  });
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <PasswordCard
              currentPassword={formData.currentPassword}
              newPassword={formData.newPassword}
              confirmPassword={formData.confirmPassword}
              setCurrentPassword={setters.setCurrentPassword}
              setNewPassword={setters.setNewPassword}
              setConfirmPassword={setters.setConfirmPassword}
              handleChangePassword={(e) => {
                e.preventDefault();
                handleChangePassword(
                  formData.currentPassword,
                  formData.newPassword,
                  formData.confirmPassword
                );
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
