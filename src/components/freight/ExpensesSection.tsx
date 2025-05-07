
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

interface ExpensesSectionProps {
  thirdPartyDriverCost: number;
  setThirdPartyDriverCost: (value: number) => void;
  tollExpenses: number;
  setTollExpenses: (value: number) => void;
  fuelExpenses: number;
  setFuelExpenses: (value: number) => void;
  mealExpenses: number;
  setMealExpenses: (value: number) => void;
  helperExpenses: number;
  setHelperExpenses: (value: number) => void;
  accommodationExpenses: number;
  setAccommodationExpenses: (value: number) => void;
  totalExpenses: number;
  netProfit: number;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  thirdPartyDriverCost,
  setThirdPartyDriverCost,
  tollExpenses,
  setTollExpenses,
  fuelExpenses,
  setFuelExpenses,
  mealExpenses,
  setMealExpenses,
  helperExpenses,
  setHelperExpenses,
  accommodationExpenses,
  setAccommodationExpenses,
  totalExpenses,
  netProfit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas do Frete</CardTitle>
        <CardDescription>Registre todas as despesas para calcular o lucro líquido</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="thirdPartyDriverCost">Motorista Terceiro (R$)</Label>
            <Input
              id="thirdPartyDriverCost"
              type="number"
              step="0.01"
              value={thirdPartyDriverCost.toString()}
              onChange={(e) => setThirdPartyDriverCost(Number(e.target.value))}
              placeholder="Custo com motorista terceirizado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tollExpenses">Pedágio (R$)</Label>
            <Input
              id="tollExpenses"
              type="number"
              step="0.01"
              value={tollExpenses.toString()}
              onChange={(e) => setTollExpenses(Number(e.target.value))}
              placeholder="Gastos com pedágio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelExpenses">Abastecimento (R$)</Label>
            <Input
              id="fuelExpenses"
              type="number"
              step="0.01"
              value={fuelExpenses.toString()}
              onChange={(e) => setFuelExpenses(Number(e.target.value))}
              placeholder="Custos com combustível"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealExpenses">Refeição (R$)</Label>
            <Input
              id="mealExpenses"
              type="number"
              step="0.01"
              value={mealExpenses.toString()}
              onChange={(e) => setMealExpenses(Number(e.target.value))}
              placeholder="Gastos com alimentação"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="helperExpenses">Ajudante (R$)</Label>
            <Input
              id="helperExpenses"
              type="number"
              step="0.01"
              value={helperExpenses.toString()}
              onChange={(e) => setHelperExpenses(Number(e.target.value))}
              placeholder="Custos com ajudantes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accommodationExpenses">Hotel/Pousada (R$)</Label>
            <Input
              id="accommodationExpenses"
              type="number"
              step="0.01"
              value={accommodationExpenses.toString()}
              onChange={(e) => setAccommodationExpenses(Number(e.target.value))}
              placeholder="Gastos com hospedagem"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total de Despesas:</span>
              <span className="text-lg font-bold">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Lucro Líquido:</span>
              <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
