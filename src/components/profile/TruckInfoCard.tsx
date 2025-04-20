
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Truck } from "lucide-react";
import { TruckInfoCardProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VEHICLE_TYPES, BODY_TYPES } from "@/utils/constants";

const TruckInfoCard: React.FC<TruckInfoCardProps> = ({
  licensePlate,
  trailerPlate,
  anttCode,
  vehicleYear,
  vehicleModel,
  vehicleType,
  bodyType,
  setLicensePlate,
  setTrailerPlate,
  setAnttCode,
  setVehicleYear,
  setVehicleModel,
  setVehicleType,
  setBodyType,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Veículo</CardTitle>
        <CardDescription>
          Cadastre as informações do seu veículo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Placa do Veículo</Label>
            <Input
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="ABC-1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trailerPlate">Placa do Reboque (opcional)</Label>
            <Input
              id="trailerPlate"
              value={trailerPlate}
              onChange={(e) => setTrailerPlate(e.target.value)}
              placeholder="XYZ-5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="anttCode">Código ANTT</Label>
            <Input
              id="anttCode"
              value={anttCode}
              onChange={(e) => setAnttCode(e.target.value)}
              placeholder="Número do registro ANTT"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Ano do Veículo</Label>
              <Input
                id="vehicleYear"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Modelo do Veículo</Label>
              <Input
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Modelo do veículo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Tipo do Veículo</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo do veículo" />
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
            <Select value={bodyType} onValueChange={setBodyType}>
              <SelectTrigger>
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

          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Salvar Informações do Veículo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TruckInfoCard;
