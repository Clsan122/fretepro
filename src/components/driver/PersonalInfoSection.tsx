
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCPF, formatBrazilianPhone } from "@/utils/formatters";

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
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onCPFChange(value);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onPhoneChange(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Motorista</CardTitle>
        <CardDescription>Informe os dados pessoais do motorista</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" variant="required">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nome completo do motorista"
              className="focus:border-freight-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" variant="required">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="Apenas números"
              inputMode="numeric"
              maxLength={11}
              className="focus:border-freight-600"
            />
            {cpf && (
              <p className="text-xs text-muted-foreground">
                Formato: {formatCPF(cpf)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" variant="required">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(XX) XXXXX-XXXX"
              inputMode="tel"
              required
              className="focus:border-freight-600"
            />
            {phone && (
              <p className="text-xs text-muted-foreground">
                Formato: {formatBrazilianPhone(phone)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Rua, número, bairro, complemento, cidade, estado, CEP"
              className="min-h-[100px] focus:border-freight-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
