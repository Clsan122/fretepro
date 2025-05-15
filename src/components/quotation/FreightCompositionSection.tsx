
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatInsuranceRate } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Truck, CircleDollarSign } from "lucide-react";

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
  // Adicionando campos de origem e destino
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  // Campos de carga
  volumes: number;
  weight: number;
  vehicleType: string;
  cargoType: string;
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
  setNotes,
  // Campos adicionados
  originCity,
  originState,
  destinationCity,
  destinationState,
  volumes,
  weight,
  vehicleType,
  cargoType
}) => {
  // Handle insurance rate change
  const handleInsuranceRateChange = (newRate: number) => {
    setInsuranceRate(newRate);
    if (merchandiseValue > 0) {
      // Calculate the insurance value based on the new rate
      const calculatedInsurance = merchandiseValue * (newRate / 100);
      setInsuranceValue(calculatedInsurance);
    }
  };
  
  // Mapeamento de tipos de veículos para descrições mais amigáveis
  const vehicleTypeMap: Record<string, string> = {
    "van": "Van de Carga",
    "utility": "Utilitário Pequeno",
    "truck_small": "Caminhão 3/4",
    "truck_medium": "Caminhão Toco",
    "truck_large": "Caminhão Truck",
    "truck_extra": "Caminhão Bitruck",
    "trailer": "Carreta Simples",
    "trailer_extended": "Carreta Estendida",
    "trailer_refrigerated": "Carreta Refrigerada"
  };
  
  // Mapeamento de tipos de carga para descrições mais amigáveis
  const cargoTypeMap: Record<string, string> = {
    "general": "Carga Geral",
    "sacks": "Sacaria",
    "boxes": "Caixas",
    "units": "Unidades",
    "bulk": "Granel",
    "dangerous": "Carga Perigosa",
    "refrigerated": "Refrigerada"
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
      <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
        <CardTitle className="text-freight-700 dark:text-freight-300">
          Resumo da Cotação de Frete
        </CardTitle>
        <CardDescription>
          Visão completa das informações do frete e valores
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Origem e Destino */}
        <div className="bg-freight-50/30 dark:bg-freight-900/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-freight-600 dark:text-freight-400" />
            <h3 className="font-semibold text-lg text-freight-700 dark:text-freight-300">
              Origem e Destino
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Origem:</p>
              <p className="font-medium">{originCity} - {originState}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Destino:</p>
              <p className="font-medium">{destinationCity} - {destinationState}</p>
            </div>
          </div>
        </div>
        
        {/* Informações da Carga */}
        <div className="bg-freight-50/30 dark:bg-freight-900/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-freight-600 dark:text-freight-400" />
            <h3 className="font-semibold text-lg text-freight-700 dark:text-freight-300">
              Detalhes da Carga
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Volumes:</p>
              <p className="font-medium">{volumes}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Peso (kg):</p>
              <p className="font-medium">{weight} kg</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tipo de Carga:</p>
              <p className="font-medium">{cargoTypeMap[cargoType] || cargoType}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Valor da Mercadoria:</p>
              <p className="font-medium">{formatCurrency(merchandiseValue)}</p>
            </div>
          </div>
        </div>
        
        {/* Tipo de Veículo */}
        <div className="bg-freight-50/30 dark:bg-freight-900/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-5 w-5 text-freight-600 dark:text-freight-400" />
            <h3 className="font-semibold text-lg text-freight-700 dark:text-freight-300">
              Veículo
            </h3>
          </div>
          <p className="font-medium">{vehicleTypeMap[vehicleType] || vehicleType}</p>
        </div>

        <Separator className="my-2" />
        
        {/* Composição de Valor do Frete */}
        <div className="bg-freight-50/30 dark:bg-freight-900/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CircleDollarSign className="h-5 w-5 text-freight-600 dark:text-freight-400" />
            <h3 className="font-semibold text-lg text-freight-700 dark:text-freight-300">
              Composição do Frete
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freightValue" className="text-base">Valor do Frete</Label>
              <Input id="freightValue" type="number" step="0.01" value={freightValue.toString()} onChange={e => setFreightValue(Number(e.target.value))} placeholder="Valor do frete" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tollValue" className="text-base">Pedágio</Label>
              <Input id="tollValue" type="number" step="0.01" value={tollValue.toString()} onChange={e => setTollValue(Number(e.target.value))} placeholder="Valor do pedágio" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
            </div>

            <div className="space-y-2 px-0 mx-0 py-0">
              <Label htmlFor="insuranceValue" className="text-base">Seguro</Label>
              <div className="flex items-center space-x-2 px-0 mx-0">
                <div className="relative flex-grow">
                  <Input id="insuranceValue" type="number" step="0.01" value={insuranceValue.toString()} onChange={e => setInsuranceValue(Number(e.target.value))} placeholder="Valor do seguro" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500 mx-0 px-[9px]" />
                </div>
                <div className="flex w-24 items-center px-[3px] mx-[34px]">
                  <Input id="insuranceRate" type="number" step="0.000001" value={insuranceRate.toString()} onChange={e => handleInsuranceRateChange(Number(e.target.value))} min="0" max="100" className="w-16 text-center transition-all focus:ring-freight-500 focus:border-freight-500 px-px mx-[8px]" />
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-base">Observações</Label>
          <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Adicione observações relevantes para esta cotação" className="min-h-[100px] transition-all focus:ring-freight-500 focus:border-freight-500" />
        </div>
      </CardContent>
      
      <CardFooter className="bg-freight-50/50 dark:bg-freight-900/50 border-t border-freight-100 dark:border-freight-800 flex justify-between items-center py-[3px]">
        <div className="flex items-center space-x-2">
          <span className="text-freight-700 dark:text-freight-300 font-medium">Total:</span>
        </div>
        <div className="text-xl font-bold text-freight-700 dark:text-freight-300 py-0 my-[6px]">
          {formatCurrency(totalValue)}
        </div>
      </CardFooter>
    </Card>
  );
};
