import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Measurement } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyWithoutSymbol } from "@/utils/formatters";
interface CargoProps {
  volumes: number;
  setVolumes: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  merchandiseValue: number;
  setMerchandiseValue: (value: number) => void;
  cubicMeasurement: number;
  measurements: Measurement[];
  handleAddMeasurement: () => void;
  handleRemoveMeasurement: (id: string) => void;
  handleMeasurementChange: (id: string, field: keyof Measurement, value: number) => void;
}
export const CargoSection: React.FC<CargoProps> = ({
  volumes,
  setVolumes,
  weight,
  setWeight,
  merchandiseValue,
  setMerchandiseValue,
  cubicMeasurement,
  measurements,
  handleAddMeasurement,
  handleRemoveMeasurement,
  handleMeasurementChange
}) => {
  // Função para formatar o valor monetário com o prefixo R$
  const displayMerchandiseValue = merchandiseValue > 0 ? `R$ ${formatCurrencyWithoutSymbol(merchandiseValue)}` : "";
  return <Card>
      <CardHeader>
        <CardTitle>Dados da Carga</CardTitle>
        <CardDescription>Informe as características da carga a ser transportada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="volumes">Quantidade de Volumes</Label>
            <Input id="volumes" type="number" value={volumes.toString()} onChange={e => setVolumes(Number(e.target.value))} placeholder="Quantidade de volumes" min="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" step="0.01" value={weight.toString()} onChange={e => setWeight(Number(e.target.value))} placeholder="Peso total em kg" min="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cubicMeasurement">Cubagem (m³)</Label>
            <Input id="cubicMeasurement" type="number" step="0.001" value={cubicMeasurement.toFixed(3)} readOnly className="bg-gray-100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchandiseValue">Valor da Mercadoria (R$)</Label>
            <Input id="merchandiseValue" type="number" step="0.01" value={merchandiseValue.toString()} onChange={e => setMerchandiseValue(Number(e.target.value))} placeholder="Valor da mercadoria" min="0" />
          </div>
        </div>

        {/* Measurements Section (moved from separate component) */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Medidas</h3>
            <Button type="button" onClick={handleAddMeasurement} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Adicionar Medida
            </Button>
          </div>
          
          <div className="space-y-4">
            {measurements.map((measurement, index) => <div key={measurement.id} className="flex flex-wrap items-end gap-3">
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Comprimento (cm)</Label>
                  <Input type="number" value={measurement.length.toString()} onChange={e => handleMeasurementChange(measurement.id, "length", Number(e.target.value))} min="0" step="0.1" />
                </div>
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Largura (cm)</Label>
                  <Input type="number" value={measurement.width.toString()} onChange={e => handleMeasurementChange(measurement.id, "width", Number(e.target.value))} min="0" step="0.1" />
                </div>
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Altura (cm)</Label>
                  <Input type="number" value={measurement.height.toString()} onChange={e => handleMeasurementChange(measurement.id, "height", Number(e.target.value))} min="0" step="0.1" />
                </div>
                <div className="space-y-1 flex-1 min-w-[100px]">
                  <Label>Quantidade</Label>
                  <Input type="number" value={measurement.quantity.toString()} onChange={e => handleMeasurementChange(measurement.id, "quantity", Number(e.target.value))} min="1" />
                </div>
                {measurements.length > 1 && <Button type="button" onClick={() => handleRemoveMeasurement(measurement.id)} variant="destructive" size="icon" className="h-10 w-10">
                    <Minus className="h-4 w-4" />
                  </Button>}
              </div>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};