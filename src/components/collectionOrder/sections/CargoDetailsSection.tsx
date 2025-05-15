
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Measurement } from "@/types";
import { formatCurrencyWithoutSymbol } from "@/utils/formatters";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface CargoDetailsSectionProps {
  volumes: number;
  weight: number;
  merchandiseValue: number;
  cubicMeasurement: number;
  measurements: Measurement[];
  onVolumesChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onMerchandiseValueChange: (value: number) => void;
  onMeasurementChange: (id: string, field: keyof Measurement, value: number) => void;
  onAddMeasurement: () => void;
  onRemoveMeasurement: (id: string) => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

export const CargoDetailsSection: React.FC<CargoDetailsSectionProps> = ({
  volumes,
  weight,
  merchandiseValue,
  cubicMeasurement,
  measurements,
  onVolumesChange,
  onWeightChange,
  onMerchandiseValueChange,
  onMeasurementChange,
  onAddMeasurement,
  onRemoveMeasurement,
  form
}) => {
  // Função para formatar o valor monetário com o prefixo R$
  const displayMerchandiseValue = merchandiseValue > 0 ? `R$ ${formatCurrencyWithoutSymbol(merchandiseValue)}` : "";

  const handleVolumesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onVolumesChange(value);
    form.setValue("volumes", value, { shouldValidate: true });
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onWeightChange(value);
    form.setValue("weight", value, { shouldValidate: true });
  };

  const handleMerchandiseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onMerchandiseValueChange(value);
    form.setValue("merchandiseValue", value, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Dados da Carga</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FormField
            control={form.control}
            name="volumes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Volumes</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    value={volumes.toString()}
                    onChange={handleVolumesChange}
                    placeholder="Quantidade de volumes"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={weight.toString()}
                    onChange={handleWeightChange}
                    placeholder="Peso total em kg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Cubagem (m³)</Label>
            <Input 
              type="number"
              step="0.001"
              value={cubicMeasurement.toFixed(3)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <FormField
            control={form.control}
            name="merchandiseValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Mercadoria (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={merchandiseValue.toString()}
                    onChange={handleMerchandiseValueChange}
                    placeholder="Valor da mercadoria"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Medidas</h3>
            <Button type="button" onClick={onAddMeasurement} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Adicionar Medida
            </Button>
          </div>
          
          <div className="space-y-4">
            {measurements.map((measurement, index) => (
              <div key={measurement.id} className="flex flex-wrap items-end gap-3">
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Comprimento (cm)</Label>
                  <Input 
                    type="number"
                    value={measurement.length.toString()}
                    onChange={(e) => onMeasurementChange(measurement.id, "length", Number(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Largura (cm)</Label>
                  <Input 
                    type="number"
                    value={measurement.width.toString()}
                    onChange={(e) => onMeasurementChange(measurement.id, "width", Number(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Altura (cm)</Label>
                  <Input 
                    type="number"
                    value={measurement.height.toString()}
                    onChange={(e) => onMeasurementChange(measurement.id, "height", Number(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Quantidade</Label>
                  <Input 
                    type="number"
                    value={measurement.quantity.toString()}
                    onChange={(e) => onMeasurementChange(measurement.id, "quantity", Number(e.target.value))}
                    min="1"
                  />
                </div>
                {measurements.length > 1 && (
                  <Button 
                    type="button" 
                    onClick={() => onRemoveMeasurement(measurement.id)} 
                    variant="destructive" 
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
