
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";

interface CargoDetailsSectionProps {
  volumes: number;
  weight: number;
  merchandiseValue: number;
  cubicMeasurement: number;
  measurements: any[];
  onVolumesChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onMerchandiseValueChange: (value: number) => void;
  onMeasurementChange: (index: number, field: string, value: any) => void;
  onAddMeasurement: () => void;
  onRemoveMeasurement: (index: number) => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

const CargoDetailsSection: React.FC<CargoDetailsSectionProps> = ({
  volumes,
  weight,
  merchandiseValue,
  onVolumesChange,
  onWeightChange,
  onMerchandiseValueChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Carga</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="volumes">Volumes</Label>
            <Input
              id="volumes"
              type="number"
              value={volumes}
              onChange={(e) => onVolumesChange(Number(e.target.value))}
              min="1"
            />
          </div>
          
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => onWeightChange(Number(e.target.value))}
              min="0.01"
            />
          </div>
          
          <div>
            <Label htmlFor="value">Valor da Mercadoria (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={merchandiseValue}
              onChange={(e) => onMerchandiseValueChange(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { CargoDetailsSection };
