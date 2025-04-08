
import React from "react";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Save, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PersonalInfoCardProps {
  user: User | null;
  name: string;
  email: string;
  birthDate: Date | undefined;
  cpf: string;
  phone: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setBirthDate: (date: Date | undefined) => void;
  setCpf: (cpf: string) => void;
  setPhone: (phone: string) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  user,
  name,
  email,
  birthDate,
  cpf,
  phone,
  setName,
  setEmail,
  setBirthDate,
  setCpf,
  setPhone,
  handleUpdateProfile,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
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
              onChange={(e) => setCpf(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birthDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                  locale={ptBR}
                  disabled={(date) => date > new Date()}
                  fromYear={1940}
                  toYear={new Date().getFullYear() - 18}
                  captionLayout="dropdown-buttons"
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
