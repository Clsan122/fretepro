
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Truck, Loader2 } from "lucide-react";
import { VEHICLE_TYPES, BODY_TYPES } from "@/utils/constants";

interface DriverVehicleCardProps {
  isDriver: boolean;
  licensePlate: string;
  trailerPlate: string;
  vehicleType: string;
  bodyType: string;
  anttCode: string;
  vehicleYear: string;
  vehicleModel: string;
  setIsDriver: (value: boolean) => void;
  setLicensePlate: (value: string) => void;
  setTrailerPlate: (value: string) => void;
  setVehicleType: (value: string) => void;
  setBodyType: (value: string) => void;
  setAnttCode: (value: string) => void;
  setVehicleYear: (value: string) => void;
  setVehicleModel: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating?: boolean;
}

const DriverVehicleCard: React.FC<DriverVehicleCardProps> = ({
  isDriver,
  licensePlate,
  trailerPlate,
  vehicleType,
  bodyType,
  anttCode,
  vehicleYear,
  vehicleModel,
  setIsDriver,
  setLicensePlate,
  setTrailerPlate,
  setVehicleType,
  setBodyType,
  setAnttCode,
  setVehicleYear,
  setVehicleModel,
  onSubmit,
  isUpdating
}) => {
  const formatLicensePlate = (value: string) => {
    const plateText = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (plateText.length <= 3) return plateText;
    if (plateText.length > 3) return `${plateText.slice(0, 3)}-${plateText.slice(3, 7)}`;
    return plateText;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicensePlate(formatLicensePlate(e.target.value));
  };

  const handleTrailerPlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrailerPlate(formatLicensePlate(e.target.value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Dados de Motorista e Veículo
        </CardTitle>
        <CardDescription>
          Informações sobre suas atividades como motorista e dados do veículo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDriver"
              checked={isDriver}
              onCheckedChange={(checked) => setIsDriver(checked as boolean)}
            />
            <Label htmlFor="isDriver">Sou motorista</Label>
          </div>

          {isDriver && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate" variant="required">Placa do Veículo</Label>
                  <Input
                    id="licensePlate"
                    value={licensePlate}
                    onChange={handleLicensePlateChange}
                    placeholder="ABC-1234"
                    maxLength={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trailerPlate">Placa da Carreta</Label>
                  <Input
                    id="trailerPlate"
                    value={trailerPlate}
                    onChange={handleTrailerPlateChange}
                    placeholder="ABC-1234 (opcional)"
                    maxLength={8}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" variant="required">Tipo de Veículo</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
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
                  <Label htmlFor="bodyType" variant="required">Tipo de Carroceria</Label>
                  <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a carroceria" />
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
                <Label htmlFor="anttCode" variant="required">Código ANTT</Label>
                <Input
                  id="anttCode"
                  value={anttCode}
                  onChange={(e) => setAnttCode(e.target.value)}
                  placeholder="Digite o código ANTT"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" variant="required">Ano do Veículo</Label>
                  <Input
                    id="vehicleYear"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="2020"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleModel" variant="required">Modelo do Veículo</Label>
                  <Input
                    id="vehicleModel"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="Ex: Scania R450"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Dados de Motorista
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverVehicleCard;
