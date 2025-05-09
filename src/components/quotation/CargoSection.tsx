import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface Measurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}
interface CargoSectionProps {
  volumes: number;
  setVolumes: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  merchandiseValue: number;
  setMerchandiseValue: (value: number) => void;
  cargoType: string;
  setCargoType: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  measurements: Measurement[];
  handleAddMeasurement: () => void;
  handleRemoveMeasurement: (id: string) => void;
  handleMeasurementChange: (id: string, field: keyof Measurement, value: number) => void;
}
const CARGO_TYPES = [{
  value: "general",
  label: "Carga Geral"
}, {
  value: "sacks",
  label: "Sacaria"
}, {
  value: "boxes",
  label: "Caixas"
}, {
  value: "units",
  label: "Unidades"
}, {
  value: "bulk",
  label: "Granel"
}, {
  value: "dangerous",
  label: "Carga Perigosa"
}, {
  value: "refrigerated",
  label: "Refrigerada"
}];
const VEHICLE_TYPES = [{
  value: "van",
  label: "Van de Carga"
}, {
  value: "utility",
  label: "Utilitário Pequeno"
}, {
  value: "truck_small",
  label: "Caminhão 3/4"
}, {
  value: "truck_medium",
  label: "Caminhão Toco"
}, {
  value: "truck_large",
  label: "Caminhão Truck"
}, {
  value: "truck_extra",
  label: "Caminhão Bitruck"
}, {
  value: "trailer",
  label: "Carreta Simples"
}, {
  value: "trailer_extended",
  label: "Carreta Estendida"
}, {
  value: "trailer_refrigerated",
  label: "Carreta Refrigerada"
}];
export const CargoSection: React.FC<CargoSectionProps> = ({
  volumes,
  setVolumes,
  weight,
  setWeight,
  merchandiseValue,
  setMerchandiseValue,
  cargoType,
  setCargoType,
  vehicleType,
  setVehicleType,
  measurements,
  handleAddMeasurement,
  handleRemoveMeasurement,
  handleMeasurementChange
}) => {
  return <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
      <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
        <CardTitle className="text-freight-700 dark:text-freight-300">
          Dados do Material
        </CardTitle>
        <CardDescription>
          Informe as características da carga a ser transportada
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Basic cargo details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volumes">Quantidade de Volumes</Label>
            <Input id="volumes" type="number" value={volumes.toString()} onChange={e => setVolumes(Number(e.target.value))} placeholder="Quantidade de volumes" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" step="0.01" value={weight.toString()} onChange={e => setWeight(Number(e.target.value))} placeholder="Peso total em kg" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargoType">Tipo de Carga</Label>
            <Select value={cargoType} onValueChange={setCargoType}>
              <SelectTrigger id="cargoType" className="w-full">
                <SelectValue placeholder="Selecione o tipo de carga" />
              </SelectTrigger>
              <SelectContent>
                {CARGO_TYPES.map(type => <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                    {type.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchandiseValue">Valor da Mercadoria (R$)</Label>
            <Input id="merchandiseValue" type="number" step="0.01" value={merchandiseValue.toString()} onChange={e => setMerchandiseValue(Number(e.target.value))} placeholder="Valor da mercadoria" min="0" className="transition-all focus:ring-freight-500 focus:border-freight-500" />
          </div>
        </div>

        {/* Measurements */}
        <div className="border-t pt-4 border-freight-100 dark:border-freight-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-freight-700 dark:text-freight-300">Medidas</h3>
            <Button type="button" onClick={handleAddMeasurement} variant="outline" size="sm" className="hover:bg-freight-50 dark:hover:bg-freight-900 transition-colors">
              <Plus className="h-4 w-4 mr-1" /> Adicionar Medida
            </Button>
          </div>
          
          <div className="space-y-4">
            {measurements.map(measurement => <div key={measurement.id} className="grid grid-cols-12 gap-2 items-center bg-freight-50/30 dark:bg-freight-900/30 p-3 rounded-md">
                <div className="col-span-3 space-y-1">
                  <Label htmlFor={`length-${measurement.id}`} className="text-sm">C. (cm)</Label>
                  <Input id={`length-${measurement.id}`} type="number" step="0.1" value={measurement.length.toString()} onChange={e => handleMeasurementChange(measurement.id, 'length', Number(e.target.value))} min="0" className="text-sm" />
                </div>
                
                <div className="col-span-3 space-y-1">
                  <Label htmlFor={`width-${measurement.id}`} className="text-sm">L. (cm)</Label>
                  <Input id={`width-${measurement.id}`} type="number" step="0.1" value={measurement.width.toString()} onChange={e => handleMeasurementChange(measurement.id, 'width', Number(e.target.value))} min="0" className="text-sm" />
                </div>
                
                <div className="col-span-3 space-y-1">
                  <Label htmlFor={`height-${measurement.id}`} className="text-sm">A. (cm)</Label>
                  <Input id={`height-${measurement.id}`} type="number" step="0.1" value={measurement.height.toString()} onChange={e => handleMeasurementChange(measurement.id, 'height', Number(e.target.value))} min="0" className="text-sm" />
                </div>
                
                <div className="col-span-2 space-y-1 my-[2px] py-[8px]">
                  <Label htmlFor={`quantity-${measurement.id}`} className="text-sm py-0">Qnt.</Label>
                  <Input id={`quantity-${measurement.id}`} type="number" value={measurement.quantity.toString()} onChange={e => handleMeasurementChange(measurement.id, 'quantity', Number(e.target.value))} min="1" className="text-sm py-0 my-[12px] px-[7px]" />
                </div>
                
                <div className="col-span-1 flex items-end justify-center">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMeasurement(measurement.id)} disabled={measurements.length <= 1} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="border-t pt-4 border-freight-100 dark:border-freight-800">
          <div className="space-y-2">
            <Label htmlFor="vehicleType" className="text-lg font-medium text-freight-700 dark:text-freight-300">
              <Truck className="h-5 w-5 inline-block mr-2 mb-1" /> 
              Tipo de Veículo
            </Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger id="vehicleType" className="w-full">
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map(type => <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                    {type.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>;
};