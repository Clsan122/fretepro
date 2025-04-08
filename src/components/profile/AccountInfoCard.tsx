
import React from "react";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User as UserIcon } from "lucide-react";

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
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;
