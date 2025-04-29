
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Check, RefreshCw } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PaymentInfoSectionProps {
  pixKey: string;
  setPixKey: (value: string) => void;
  paymentTerm: string;
  setPaymentTerm: (value: string) => void;
  requesterName: string;
  setRequesterName: (value: string) => void;
}

export const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({
  pixKey,
  setPixKey,
  paymentTerm,
  setPaymentTerm,
  requesterName,
  setRequesterName
}) => {
  const { user } = useAuth();
  const [useProfileData, setUseProfileData] = useState(false);

  const paymentTermOptions = [
    { value: "À vista", label: "À vista" },
    { value: "Por semana", label: "Por semana" },
    { value: "7 dias", label: "7 dias" },
    { value: "10 dias", label: "10 dias" },
    { value: "12 dias", label: "12 dias" },
    { value: "15 dias", label: "15 dias" },
    { value: "20 dias", label: "20 dias" },
    { value: "25 dias", label: "25 dias" },
    { value: "30 dias", label: "30 dias" },
    { value: "custom", label: "Outro" },
  ];

  const handleUseProfileData = (checked: boolean) => {
    setUseProfileData(checked);
    if (checked && user) {
      if (user.pixKey) setPixKey(user.pixKey);
      if (user.name) setRequesterName(user.name);
    }
  };

  const handleResetFields = () => {
    setPixKey("");
    setRequesterName("");
    setUseProfileData(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Informações de Pagamento</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Usar dados do perfil</span>
          <Switch
            checked={useProfileData}
            onCheckedChange={handleUseProfileData}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="requesterName">Solicitante</Label>
            <Input
              id="requesterName"
              placeholder="Nome do solicitante"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              disabled={useProfileData}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            <Input
              id="pixKey"
              placeholder="Chave PIX"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              disabled={useProfileData}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentTerm">Prazo de Pagamento</Label>
          <Select 
            value={paymentTerm} 
            onValueChange={setPaymentTerm}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o prazo de pagamento" />
            </SelectTrigger>
            <SelectContent>
              {paymentTermOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {paymentTerm === "custom" && (
            <Input
              className="mt-2"
              placeholder="Especifique o prazo de pagamento"
              value={paymentTerm === "custom" ? "" : paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
            />
          )}
        </div>
        {useProfileData && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetFields}
            className="mt-2 gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Limpar dados de perfil
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
