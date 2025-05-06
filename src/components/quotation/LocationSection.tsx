
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCitiesByUf } from "@/hooks/useCitiesByUf";
import { BRAZILIAN_STATES } from "@/utils/constants";

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
  const { cities: originCities, loading: originLoading } = useCitiesByUf(originState);
  const { cities: destinationCities, loading: destinationLoading } = useCitiesByUf(destinationState);

  const setOriginCity = (city: string) => updateField("originCity", city);
  const setOriginState = (state: string) => updateField("originState", state);
  const setDestinationCity = (city: string) => updateField("destinationCity", city);
  const setDestinationState = (state: string) => updateField("destinationState", state);

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
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originCity">Cidade de Origem</Label>
              {originState ? (
                originCities.length > 0 ? (
                  <Select
                    value={originCity}
                    onValueChange={setOriginCity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={originLoading ? "Carregando..." : "Selecione a cidade"} />
                    </SelectTrigger>
                    <SelectContent>
                      {originCities.map(city => (
                        <SelectItem key={city.codigo_ibge} value={city.nome}>
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    id="originCity" 
                    value={originCity} 
                    onChange={(e) => setOriginCity(e.target.value)} 
                    placeholder={originLoading ? "Carregando cidades..." : "Digite o nome da cidade"} 
                  />
                )
              ) : (
                <Input 
                  id="originCity" 
                  value={originCity} 
                  onChange={(e) => setOriginCity(e.target.value)} 
                  placeholder="Selecione um estado primeiro" 
                  disabled={!originState}
                />
              )}
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
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Cidade de Destino</Label>
              {destinationState ? (
                destinationCities.length > 0 ? (
                  <Select
                    value={destinationCity}
                    onValueChange={setDestinationCity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={destinationLoading ? "Carregando..." : "Selecione a cidade"} />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationCities.map(city => (
                        <SelectItem key={city.codigo_ibge} value={city.nome}>
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    id="destinationCity" 
                    value={destinationCity} 
                    onChange={(e) => setDestinationCity(e.target.value)} 
                    placeholder={destinationLoading ? "Carregando cidades..." : "Digite o nome da cidade"} 
                  />
                )
              ) : (
                <Input 
                  id="destinationCity" 
                  value={destinationCity} 
                  onChange={(e) => setDestinationCity(e.target.value)} 
                  placeholder="Selecione um estado primeiro" 
                  disabled={!destinationState}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
