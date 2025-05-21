
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VEHICLE_TYPES, BODY_TYPES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface VehicleInfoSectionProps {
  licensePlate: string;
  trailerPlate: string;
  vehicleType: string;
  bodyType: string;
  anttCode: string;
  vehicleYear: string;
  vehicleModel: string;
  onLicensePlateChange: (value: string) => void;
  onTrailerPlateChange: (value: string) => void;
  onVehicleTypeChange: (value: string) => void;
  onBodyTypeChange: (value: string) => void;
  onAnttCodeChange: (value: string) => void;
  onVehicleYearChange: (value: string) => void;
  onVehicleModelChange: (value: string) => void;
}

export const VehicleInfoSection: React.FC<VehicleInfoSectionProps> = ({
  licensePlate,
  trailerPlate,
  vehicleType,
  bodyType,
  anttCode,
  vehicleYear,
  vehicleModel,
  onLicensePlateChange,
  onTrailerPlateChange,
  onVehicleTypeChange,
  onBodyTypeChange,
  onAnttCodeChange,
  onVehicleYearChange,
  onVehicleModelChange,
}) => {
  const handleAnttSearch = () => {
    window.open('https://consultapublica.antt.gov.br/Site/ConsultaRNTRC.aspx/consultapublica', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Veículo</CardTitle>
        <CardDescription>Informe os dados do veículo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Placa do Veículo</Label>
            <Input
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => onLicensePlateChange(e.target.value)}
              placeholder="Placa do veículo"
              maxLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trailerPlate">Placa da Carreta (Opcional)</Label>
            <Input
              id="trailerPlate"
              value={trailerPlate}
              onChange={(e) => onTrailerPlateChange(e.target.value)}
              placeholder="Placa da carreta (se aplicável)"
              maxLength={8}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Tipo de Veículo</Label>
              <Select value={vehicleType} onValueChange={onVehicleTypeChange}>
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

            <div className="space-y-2">
              <Label htmlFor="bodyType">Tipo de Carroceria</Label>
              <Select value={bodyType} onValueChange={onBodyTypeChange}>
                <SelectTrigger id="bodyType">
                  <SelectValue placeholder="Selecione o tipo de carroceria" />
                </SelectTrigger>
                <SelectContent>
                  {BODY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="anttCode">Código ANTT</Label>
                <Input
                  id="anttCode"
                  value={anttCode}
                  onChange={(e) => onAnttCodeChange(e.target.value)}
                  placeholder="Digite o código ANTT"
                  required
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleAnttSearch}
              >
                <ExternalLink className="h-4 w-4" />
                Consultar ANTT
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Ano do Veículo</Label>
              <Input
                id="vehicleYear"
                value={vehicleYear}
                onChange={(e) => onVehicleYearChange(e.target.value)}
                placeholder="Ano do veículo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Modelo do Veículo</Label>
              <Input
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => onVehicleModelChange(e.target.value)}
                placeholder="Modelo do veículo"
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
