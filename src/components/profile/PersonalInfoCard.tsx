
import React, { useRef } from "react";
import { PersonalInfoCardProps } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Phone, Mail, Upload, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBrazilianPhone, formatCPF } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Se o usuário forneceu uma função para upload de avatar, use-a
      if (handleAvatarUpload) {
        handleAvatarUpload(file);
        return;
      }
      
      // Caso contrário, implementamos o upload padrão para o Supabase Storage
      const fileName = `${user?.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Verifica se o bucket 'avatars' existe, se não, vamos usar o bucket público por enquanto
      const bucketName = 'avatars';
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Obter a URL pública do avatar
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      // Atualizar o estado do avatar
      setAvatar(publicUrl);
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
      
    } catch (error: any) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message || "Ocorreu um erro ao atualizar sua foto de perfil.",
        variant: "destructive"
      });
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
            >
              <Upload className="h-4 w-4" />
              Alterar foto
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
            />
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
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            <Input
              id="pixKey"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
            />
          </div>
          
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Atualizar Perfil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
