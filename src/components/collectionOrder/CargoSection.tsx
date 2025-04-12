
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

interface CargoProps {
  volumes: number;
  setVolumes: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  merchandiseValue: number;
  setMerchandiseValue: (value: number) => void;
  cubicMeasurement: number;
}

export const CargoSection: React.FC<CargoProps> = ({
  volumes,
  setVolumes,
  weight,
  setWeight,
  merchandiseValue,
  setMerchandiseValue,
  cubicMeasurement
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Carga</CardTitle>
        <CardDescription>Informe as características da carga a ser transportada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volumes">Quantidade de Volumes</Label>
            <Input
              id="volumes"
              type="number"
              value={volumes.toString()}
              onChange={(e) => setVolumes(Number(e.target.value))}
              placeholder="Quantidade de volumes"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={weight.toString()}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="Peso total em kg"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cubicMeasurement">Cubagem (m³)</Label>
            <Input
              id="cubicMeasurement"
              type="number"
              step="0.001"
              value={cubicMeasurement.toFixed(3)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchandiseValue">Valor da Mercadoria (R$)</Label>
            <Input
              id="merchandiseValue"
              type="number"
              step="0.01"
              value={merchandiseValue.toString()}
              onChange={(e) => setMerchandiseValue(Number(e.target.value))}
              placeholder="Valor da mercadoria"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
