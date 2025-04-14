
import React from "react";
import { CARGO_TYPES, VEHICLE_TYPES } from "@/utils/constants";
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

interface CargoDetailsProps {
  volumes: number;
  setVolumes: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  dimensions: string;
  setDimensions: (value: string) => void;
  cubicMeasurement: number; // Keep this for compatibility
  setCubicMeasurement: (value: number) => void; // Keep this for compatibility
  cargoType: string;
  setCargoType: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
}

export const CargoDetailsSection: React.FC<CargoDetailsProps> = ({
  volumes,
  setVolumes,
  weight,
  setWeight,
  dimensions,
  setDimensions,
  cargoType,
  setCargoType,
  vehicleType,
  setVehicleType
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Dados da Carga</CardTitle>
        <CardDescription>Informe as características da carga transportada</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volumes">Volume</Label>
            <Input
              id="volumes"
              type="number"
              value={volumes.toString()}
              onChange={(e) => setVolumes(Number(e.target.value))}
              placeholder="Quantidade de volumes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight.toString()}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="Peso total em kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensões</Label>
            <Input
              id="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="Ex: 100x80x120 cm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="cargoType">Tipo de Carga</Label>
            <Select
              value={cargoType}
              onValueChange={(value) => setCargoType(value)}
            >
              <SelectTrigger id="cargoType">
                <SelectValue placeholder="Selecione o tipo de carga" />
              </SelectTrigger>
              <SelectContent>
                {CARGO_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Tipo de Veículo</Label>
            <Select
              value={vehicleType}
              onValueChange={(value) => setVehicleType(value)}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
