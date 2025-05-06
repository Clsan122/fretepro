
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CityAutocomplete } from "@/components/common/CityAutocomplete";
import { BRAZILIAN_CITIES } from "@/utils/cities-data";

interface LocationSectionProps {
  originState: string;
  originCity: string;
  destinationState: string;
  destinationCity: string;
  updateField: (field: string, value: any) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  originState,
  originCity,
  destinationState,
  destinationCity,
  updateField,
}) => {
  // Estados brasileiros para o select
  const brazilianStates = Object.keys(BRAZILIAN_CITIES).sort();

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Informações de Origem e Destino</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-base md:text-lg font-semibold pb-1 text-purple-700 border-b-2 border-purple-300 inline-block">
              ORIGEM
            </Label>
            <div>
              <Label>Estado de Origem</Label>
              <Select 
                value={originState} 
                onValueChange={(value) => updateField("originState", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cidade de Origem</Label>
              <CityAutocomplete
                stateAbbreviation={originState}
                value={originCity}
                onChange={(value) => updateField("originCity", value)}
                placeholder="Selecione a cidade"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base md:text-lg font-semibold pb-1 text-purple-700 border-b-2 border-purple-300 inline-block">
              DESTINO
            </Label>
            <div>
              <Label>Estado de Destino</Label>
              <Select 
                value={destinationState} 
                onValueChange={(value) => updateField("destinationState", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cidade de Destino</Label>
              <CityAutocomplete
                stateAbbreviation={destinationState}
                value={destinationCity}
                onChange={(value) => updateField("destinationCity", value)}
                placeholder="Selecione a cidade"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
