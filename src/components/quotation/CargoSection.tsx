
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyInput from "@/components/common/CurrencyInput";

interface CargoSectionProps {
  volumes: number;
  weight: number;
  merchandiseValue: number;
  length: number;
  width: number;
  height: number;
  vehicleType: string;
  calculateCubicMeasurement: () => number;
  updateField: (field: string, value: any) => void;
}

const CargoSection: React.FC<CargoSectionProps> = ({
  volumes,
  weight,
  merchandiseValue,
  length,
  width,
  height,
  vehicleType,
  calculateCubicMeasurement,
  updateField,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Informações da Carga</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Volumes</Label>
            <Input 
              type="number"
              value={volumes || ""} 
              onChange={(e) => updateField("volumes", Number(e.target.value))}
              placeholder="Quantidade de volumes" 
            />
          </div>
          <div>
            <Label>Peso (kg)</Label>
            <Input 
              type="number"
              value={weight || ""} 
              onChange={(e) => updateField("weight", Number(e.target.value))}
              placeholder="Peso em kg" 
            />
          </div>
          <div>
            <Label>Valor da Mercadoria (R$)</Label>
            <CurrencyInput 
              value={merchandiseValue} 
              onChange={(value) => updateField("merchandiseValue", value)}
              placeholder="Valor da mercadoria" 
            />
          </div>
        </div>
        
        {/* Dimensões */}
        <div className="mt-4">
          <Label className="text-base md:text-lg font-semibold pb-1 text-purple-700 border-b-2 border-purple-300 inline-block">
            DIMENSÕES
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div>
              <Label>Comprimento (cm)</Label>
              <Input 
                type="number"
                value={length || ""} 
                onChange={(e) => updateField("length", Number(e.target.value))}
                placeholder="Comprimento" 
              />
            </div>
            <div>
              <Label>Largura (cm)</Label>
              <Input 
                type="number"
                value={width || ""} 
                onChange={(e) => updateField("width", Number(e.target.value))}
                placeholder="Largura" 
              />
            </div>
            <div>
              <Label>Altura (cm)</Label>
              <Input 
                type="number"
                value={height || ""} 
                onChange={(e) => updateField("height", Number(e.target.value))}
                placeholder="Altura" 
              />
            </div>
          </div>
          {/* Mostrar Cubagem calculada */}
          {length > 0 && width > 0 && height > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-purple-700">
                Cubagem: {calculateCubicMeasurement().toFixed(3)} m³
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Label>Tipo de Veículo</Label>
          <Select 
            value={vehicleType} 
            onValueChange={(value) => updateField("vehicleType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo de veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VUC">VUC</SelectItem>
              <SelectItem value="3/4">3/4</SelectItem>
              <SelectItem value="Toco">Toco</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Carreta">Carreta</SelectItem>
              <SelectItem value="Bi-trem">Bi-trem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CargoSection;
