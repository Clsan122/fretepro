
import React, { useRef } from "react";
import { PersonalInfoCardProps } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Phone, Mail, Upload, User as UserIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBrazilianPhone, formatCPF } from "@/utils/formatters";

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  user,
  name,
  email,
  cpf,
  phone,
  avatar,
  pixKey,
  setName,
  setEmail,
  setCpf,
  setPhone,
  setAvatar,
  setPixKey,
  onSubmit,
  handleAvatarUpload,
  isUpdating,
  isUploading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && handleAvatarUpload) {
      try {
        const url = await handleAvatarUpload(file);
        if (url) {
          setAvatar(url);
        }
      } catch (error) {
        console.error("Erro ao fazer upload do avatar:", error);
      }
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatBrazilianPhone(e.target.value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24 border-2 border-muted">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-2xl bg-primary/10">
                {name?.charAt(0) || <UserIcon className="h-10 w-10" />}
              </AvatarFallback>
            </Avatar>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Alterar foto
                </>
              )}
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" variant="required">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" variant="required">E-mail</Label>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={true} // Email não pode ser alterado após o cadastro
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf" variant="required">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" variant="required">Telefone</Label>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            <Input
              id="pixKey"
              value={pixKey || ""}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Atualizar Perfil
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
