
import React from "react";
import { Driver } from "@/types";
import { Label } from "@/components/ui/label";
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

interface DriverSelectionProps {
  driverId: string;
  drivers: Driver[];
  setDriverId: (value: string) => void;
}

export const DriverSelectionSection: React.FC<DriverSelectionProps> = ({
  driverId,
  drivers,
  setDriverId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Motorista</CardTitle>
        <CardDescription>Selecione o motorista para este frete (opcional)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="driverId">Motorista</Label>
          <Select
            value={driverId}
            onValueChange={(value) => setDriverId(value)}
          >
            <SelectTrigger id="driverId">
              <SelectValue placeholder="Selecione um motorista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name} - {driver.licensePlate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
