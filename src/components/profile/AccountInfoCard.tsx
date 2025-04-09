
import React from "react";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User as UserIcon, Mail, Phone, MapPin, Home } from "lucide-react";

interface AccountInfoCardProps {
  user: User | null;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Conta</CardTitle>
        <CardDescription>
          Detalhes da sua conta no Frete Pro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="bg-muted rounded-full p-3">
            <UserIcon className="h-10 w-10" />
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Membro desde: {user?.createdAt ? format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR }) : "Data desconhecida"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm"><span className="font-medium">CPF:</span> {user?.cpf || "Não informado"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm"><span className="font-medium">Telefone:</span> {user?.phone || "Não informado"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm"><span className="font-medium">Email:</span> {user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 text-muted-foreground mt-1" />
              <p className="text-sm"><span className="font-medium">Endereço:</span> {user?.address || "Não informado"}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                <span className="font-medium">Cidade/Estado:</span> {user?.city || "Não informado"}/{user?.state || "Não informado"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm"><span className="font-medium">CEP:</span> {user?.zipCode || "Não informado"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;
