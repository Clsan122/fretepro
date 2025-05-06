
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { useCitiesByUf } from "@/hooks/useCitiesByUf";
import { BRAZILIAN_STATES } from "@/utils/constants";

interface LocationSectionProps {
  originCity: string;
  setOriginCity: (city: string) => void;
  originState: string;
  setOriginState: (state: string) => void;
  destinationCity: string;
  setDestinationCity: (city: string) => void;
  destinationState: string;
  setDestinationState: (state: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  originCity,
  setOriginCity,
  originState,
  setOriginState,
  destinationCity,
  setDestinationCity,
  destinationState,
  setDestinationState,
}) => {
  const { cities: originCities, loading: originLoading } = useCitiesByUf(originState);
  const { cities: destinationCities, loading: destinationLoading } = useCitiesByUf(destinationState);

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
                    <SelectItem key={state.uf} value={state.uf}>
                      {state.name} ({state.uf})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originCity">Cidade de Origem</Label>
              {originState ? (
                <Combobox
                  items={originCities.map(city => ({
                    label: city.nome,
                    value: city.nome,
                  }))}
                  value={originCity}
                  onChange={setOriginCity}
                  placeholder={originLoading ? "Carregando..." : "Selecione a cidade"}
                />
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
                    <SelectItem key={state.uf} value={state.uf}>
                      {state.name} ({state.uf})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Cidade de Destino</Label>
              {destinationState ? (
                <Combobox
                  items={destinationCities.map(city => ({
                    label: city.nome,
                    value: city.nome,
                  }))}
                  value={destinationCity}
                  onChange={setDestinationCity}
                  placeholder={destinationLoading ? "Carregando..." : "Selecione a cidade"}
                />
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
