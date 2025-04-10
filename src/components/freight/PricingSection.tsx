
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PricingProps {
  freightValue: number;
  setFreightValue: (value: number) => void;
  dailyRate: number;
  setDailyRate: (value: number) => void;
  otherCosts: number;
  setOtherCosts: (value: number) => void;
  tollCosts: number;
  setTollCosts: (value: number) => void;
  totalValue: number;
}

export const PricingSection: React.FC<PricingProps> = ({
  freightValue,
  setFreightValue,
  dailyRate,
  setDailyRate,
  otherCosts,
  setOtherCosts,
  tollCosts,
  setTollCosts,
  totalValue
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Composição do Frete</CardTitle>
        <CardDescription>Informe os valores que compõem o frete</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="freightValue">Valor do Frete (R$)</Label>
            <Input
              id="freightValue"
              type="number"
              step="0.01"
              value={freightValue.toString()}
              onChange={(e) => setFreightValue(Number(e.target.value))}
              placeholder="Valor do frete"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyRate">Diária (R$)</Label>
            <Input
              id="dailyRate"
              type="number"
              step="0.01"
              value={dailyRate.toString()}
              onChange={(e) => setDailyRate(Number(e.target.value))}
              placeholder="Valor de diárias"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherCosts">Outros Custos (R$)</Label>
            <Input
              id="otherCosts"
              type="number"
              step="0.01"
              value={otherCosts.toString()}
              onChange={(e) => setOtherCosts(Number(e.target.value))}
              placeholder="Outros custos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tollCosts">Pedágio (R$)</Label>
            <Input
              id="tollCosts"
              type="number"
              step="0.01"
              value={tollCosts.toString()}
              onChange={(e) => setTollCosts(Number(e.target.value))}
              placeholder="Valor de pedágios"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold">R$ {totalValue.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
