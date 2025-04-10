
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PAYMENT_TERMS = [
  { value: "upfront", label: "À vista" },
  { value: "tenDays", label: "10 dias" },
  { value: "fifteenDays", label: "15 dias" },
  { value: "twentyDays", label: "20 dias" },
  { value: "thirtyDays", label: "30 dias" },
  { value: "custom", label: "A combinar" },
];

interface PaymentInfoProps {
  pixKey: string;
  setPixKey: (value: string) => void;
  paymentTerm: string;
  setPaymentTerm: (value: string) => void;
}

export const PaymentInfoSection: React.FC<PaymentInfoProps> = ({
  pixKey,
  setPixKey,
  paymentTerm,
  setPaymentTerm
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados de Pagamento</CardTitle>
        <CardDescription>Informe os dados para pagamento do frete</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            <Input
              id="pixKey"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Informe sua chave PIX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerm">Prazo de Pagamento</Label>
            <Select
              value={paymentTerm}
              onValueChange={(value) => setPaymentTerm(value)}
            >
              <SelectTrigger id="paymentTerm">
                <SelectValue placeholder="Selecione o prazo" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TERMS.map((term) => (
                  <SelectItem key={term.value} value={term.value}>
                    {term.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
