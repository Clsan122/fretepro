import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
interface FreightCompositionSectionProps {
  freightValue: number;
  setFreightValue: (value: number) => void;
  tollValue: number;
  setTollValue: (value: number) => void;
  insuranceValue: number;
  setInsuranceValue: (value: number) => void;
  insuranceRate: number;
  setInsuranceRate: (value: number) => void;
  merchandiseValue: number;
  otherCosts: number;
  setOtherCosts: (value: number) => void;
  totalValue: number;
  notes: string;
  setNotes: (value: string) => void;
}
export const FreightCompositionSection: React.FC<FreightCompositionSectionProps> = ({
  freightValue,
  setFreightValue,
  tollValue,
  setTollValue,
  insuranceValue,
  setInsuranceValue,
  insuranceRate,
  setInsuranceRate,
  merchandiseValue,
  otherCosts,
  setOtherCosts,
  totalValue,
  notes,
  setNotes
}) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Handle insurance rate change
  const handleInsuranceRateChange = (newRate: number) => {
    setInsuranceRate(newRate);
    if (merchandiseValue > 0) {
      // Calculate the insurance value based on the new rate
      const calculatedInsurance = merchandiseValue * (newRate / 100);
      setInsuranceValue(calculatedInsurance);
    }
  };
  return <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
      <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
        <CardTitle className="text-freight-700 dark:text-freight-300">
          Composição do Frete
        </CardTitle>
        <CardDescription>
          Detalhe os valores e custos para compor o valor total do frete
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="freightValue" className="text-base">Valor do Frete</Label>
            <Input id="freightValue" type="number" step="0.01" value={freightValue.toString()} onChange={e => setFreightValue(Number(e.target.value))} placeholder="Valor do frete" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tollValue" className="text-base">Pedágio</Label>
            <Input id="tollValue" type="number" step="0.01" value={tollValue.toString()} onChange={e => setTollValue(Number(e.target.value))} placeholder="Valor do pedágio" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceValue" className="text-base">Seguro</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Input id="insuranceValue" type="number" step="0.01" value={insuranceValue.toString()} onChange={e => setInsuranceValue(Number(e.target.value))} placeholder="Valor do seguro" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500 px-[14px]" />
              </div>
              <div className="flex w-24 items-center px-[3px] mx-[34px]">
                <Input id="insuranceRate" type="number" step="0.01" value={insuranceRate.toString()} onChange={e => handleInsuranceRateChange(Number(e.target.value))} min="0" max="100" className="w-16 text-center transition-all focus:ring-freight-500 focus:border-freight-500 mx-0 px-0" />
                <span className="ml-1 text-xs whitespace-nowrap px-0 mx-[5px]">%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Calculado sobre o valor da mercadoria</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherCosts" className="text-base">Outros Custos</Label>
            <Input id="otherCosts" type="number" step="0.01" value={otherCosts.toString()} onChange={e => setOtherCosts(Number(e.target.value))} placeholder="Outros custos" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-base">Observações</Label>
          <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Adicione observações relevantes para esta cotação" className="min-h-[100px] transition-all focus:ring-freight-500 focus:border-freight-500" />
        </div>
      </CardContent>
      
      <CardFooter className="bg-freight-50/50 dark:bg-freight-900/50 border-t border-freight-100 dark:border-freight-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-freight-700 dark:text-freight-300 font-medium">Total:</span>
        </div>
        <div className="text-xl font-bold text-freight-700 dark:text-freight-300">
          {formatCurrency(totalValue)}
        </div>
      </CardFooter>
    </Card>;
};