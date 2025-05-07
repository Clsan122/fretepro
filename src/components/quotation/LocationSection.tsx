
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";

interface LocationSectionProps {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  updateField: (field: string, value: any) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  originCity,
  originState,
  destinationCity,
  destinationState,
  updateField,
}) => {
  const setOriginCity = (city: string) => updateField("originCity", city);
  const setOriginState = (state: string) => {
    updateField("originState", state);
    // Limpar a cidade quando o estado mudar
    updateField("originCity", "");
  };
  const setDestinationCity = (city: string) => updateField("destinationCity", city);
  const setDestinationState = (state: string) => {
    updateField("destinationState", state);
    // Limpar a cidade quando o estado mudar
    updateField("destinationCity", "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Localidade</CardTitle>
        <CardDescription>Especifique a origem e o destino da carga</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Origem</h3>
            
            <div className="space-y-2">
              <Label htmlFor="originState">Estado de Origem</Label>
              <Select value={originState} onValueChange={setOriginState}>
                <SelectTrigger id="originState">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EX">Exterior</SelectItem>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originCity">
                {originState === 'EX' ? 'País de Origem' : 'Cidade de Origem'}
              </Label>
              <CitySelectAutocomplete
                uf={originState}
                value={originCity}
                onChange={setOriginCity}
                placeholder={originState === "EX" ? "Digite o país de origem" : "Digite para buscar a cidade"}
                id="originCity"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Destino</h3>
            
            <div className="space-y-2">
              <Label htmlFor="destinationState">Estado de Destino</Label>
              <Select value={destinationState} onValueChange={setDestinationState}>
                <SelectTrigger id="destinationState">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EX">Exterior</SelectItem>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destinationCity">
                {destinationState === 'EX' ? 'País de Destino' : 'Cidade de Destino'}
              </Label>
              <CitySelectAutocomplete
                uf={destinationState}
                value={destinationCity}
                onChange={setDestinationCity}
                placeholder={destinationState === "EX" ? "Digite o país de destino" : "Digite para buscar a cidade"}
                id="destinationCity"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
