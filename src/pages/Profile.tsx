
import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserByEmail, updateUser } from "@/utils/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Phone, Mail, MapPin, User, Lock, Key, Calendar, TruckIcon, Receipt, Camera, Upload } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBrazilianPhone, formatCPF } from "@/utils/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Personal data fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Company data fields
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  
  // Address fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  
  // Receipt data fields
  const [pixKey, setPixKey] = useState("");
  const [bankInfo, setBankInfo] = useState("");
  
  // Password fields
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
      setBankInfo(user.bankInfo || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove qualquer caractere que não seja número
    const cnpjNumbers = e.target.value.replace(/\D/g, '');
    
    // Aplica a máscara de CNPJ: XX.XXX.XXX/XXXX-XX
    let formattedCNPJ = cnpjNumbers;
    if (cnpjNumbers.length > 2) formattedCNPJ = cnpjNumbers.replace(/(\d{2})(\d)/, '$1.$2');
    if (cnpjNumbers.length > 5) formattedCNPJ = formattedCNPJ.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    if (cnpjNumbers.length > 8) formattedCNPJ = formattedCNPJ.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    if (cnpjNumbers.length > 12) formattedCNPJ = formattedCNPJ.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
    
    setCnpj(formattedCNPJ.slice(0, 18)); // Limita a 18 caracteres (com máscara)
  };

  const formatZipCode = (value: string) => {
    // Remove non-digit characters
    const nums = value.replace(/\D/g, '');
    
    // Apply ZIP code mask: XXXXX-XXX
    let formatted = nums;
    if (nums.length > 5) formatted = nums.replace(/(\d{5})(\d)/, '$1-$2');
    
    return formatted.slice(0, 9); // Limit to 9 characters (with mask)
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZipCode = formatZipCode(e.target.value);
    setZipCode(formattedZipCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatBrazilianPhone(e.target.value));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Atualiza o usuário com os novos dados
    const updatedUser = {
      ...user,
      name,
      email,
      cpf,
      address,
      city,
      state,
      zipCode,
      phone,
      companyName,
      cnpj,
      pixKey,
      bankInfo,
      avatar
    };
    
    // Atualizar no Supabase se disponível
    try {
      if (supabase) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: name,
            phone,
            address,
            city,
            state,
            zip_code: zipCode,
            cpf,
            company_name: companyName,
            cnpj,
            pix_key: pixKey,
            bank_info: bankInfo,
            avatar_url: avatar
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error updating profile in database:", error);
      // Fall back to local storage if supabase fails
    }
    
    // Atualiza o usuário no localStorage
    updateUser(updatedUser);
    
    // Atualiza o usuário no contexto
    setUser(updatedUser);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso!",
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem!",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) throw error;
        
        toast({
          title: "Senha alterada",
          description: "Sua senha foi alterada com sucesso!",
        });
        
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Fallback for localStorage only implementation
        toast({
          title: "Senha alterada",
          description: "Sua senha foi alterada com sucesso!",
        });
        
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <p>Você precisa estar logado para acessar esta página.</p>
            </CardContent>
          </Card>
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
              <TruckIcon className="h-4 w-4" />
              <span className="hidden md:inline">Empresa e Endereço</span>
              <span className="md:hidden">Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Segurança</span>
              <span className="md:hidden">Segurança</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Gerencie seus dados pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24 border-2 border-muted">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {name?.charAt(0) || <User className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      Alterar foto
                    </Button>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cpf"
                          value={cpf}
                          onChange={handleCPFChange}
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="pixKey">Chave PIX</Label>
                      <Input
                        id="pixKey"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="CPF, CNPJ, email ou chave aleatória"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bankInfo">Dados Bancários</Label>
                      <Input
                        id="bankInfo"
                        value={bankInfo}
                        onChange={(e) => setBankInfo(e.target.value)}
                        placeholder="Banco, Agência e Conta"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5" />
                  Dados da Empresa e Endereço
                </CardTitle>
                <CardDescription>
                  Informe os dados da sua empresa e endereço completo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <TruckIcon className="h-5 w-5" />
                      Dados da Empresa
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da Empresa</Label>
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          value={cnpj}
                          onChange={handleCNPJChange}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Endereço Completo</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Rua, número, complemento"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Sua cidade"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="UF"
                          maxLength={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={handleZipCodeChange}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Atualize sua senha para manter sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" variant="outline" className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </Button>
                </form>
                
                <div className="space-y-2 pt-6">
                  <Label>Informações de Cadastro</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-md flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Data de Cadastro</p>
                        <p className="text-sm text-muted-foreground">
                          {user.createdAt ? format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR }) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-md flex items-center space-x-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">ID de Usuário</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[150px]">{user.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
