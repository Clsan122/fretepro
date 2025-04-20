
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCPF } from "@/utils/formatters";

interface PersonalInfoSectionProps {
  name: string;
  cpf: string;
  phone: string;
  address: string;
  onNameChange: (value: string) => void;
  onCPFChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  name,
  cpf,
  phone,
  address,
  onNameChange,
  onCPFChange,
  onPhoneChange,
  onAddressChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Motorista</CardTitle>
        <CardDescription>Informe os dados do motorista</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nome completo do motorista"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => onCPFChange(e.target.value)}
              placeholder="Apenas números"
              inputMode="numeric"
              maxLength={11}
            />
            {cpf && (
              <p className="text-xs text-muted-foreground">
                Formato: {formatCPF(cpf)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              required
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço (Opcional)</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Endereço completo"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
