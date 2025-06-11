
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
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "./schema";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface DriverSectionProps {
  driverId: string;
  drivers: Driver[];
  setDriverId: (value: string) => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

export const DriverSection: React.FC<DriverSectionProps> = ({
  driverId,
  drivers,
  setDriverId,
  form
}) => {
  return (
    <Card className="border-freight-100 dark:border-freight-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-freight-700 dark:text-freight-300 text-xl">Motorista</CardTitle>
        <CardDescription>Selecione o motorista responsável pela coleta</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="driverId" variant="required">Motorista / Veículo</Label>
              <FormControl>
                <Select
                  value={driverId}
                  onValueChange={(value) => {
                    setDriverId(value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger id="driverId" className="focus:ring-freight-500">
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
