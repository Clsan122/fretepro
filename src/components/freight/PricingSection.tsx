
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
import { formatCurrency } from "@/utils/formatters";

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
  driverExpenses?: number;
  setDriverExpenses?: (value: number) => void;
  netProfit?: number;
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
  totalValue,
  driverExpenses,
  setDriverExpenses,
  netProfit,
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

        {driverExpenses !== undefined && setDriverExpenses && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="driverExpenses">Despesas com Motorista (R$)</Label>
            <Input
              id="driverExpenses"
              type="number"
              step="0.01"
              min="0"
              value={driverExpenses}
              onChange={(e) => setDriverExpenses(Number(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>
        )}

        <div className="bg-muted p-4 rounded-lg space-y-2 mt-6">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
          </div>
          {netProfit !== undefined && (
            <div className="text-center border-t pt-2">
              <p className="text-sm font-medium text-muted-foreground">Lucro Líquido</p>
              <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
