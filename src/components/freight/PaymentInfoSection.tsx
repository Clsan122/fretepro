
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Informações de Pagamento</CardTitle>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            <Input
              id="pixKey"
              placeholder="Chave PIX"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentTerm">Prazo de Pagamento</Label>
          <Input
            id="paymentTerm"
            placeholder="Ex: 30 dias"
            value={paymentTerm}
            onChange={(e) => setPaymentTerm(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
