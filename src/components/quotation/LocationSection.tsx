
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { useCitiesByUf } from "@/hooks/useCitiesByUf";
import { brazilianStates } from "@/utils/constants";

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
  const { cities: originCities, loading: loadingOriginCities } = useCitiesByUf(originState);
  const { cities: destinationCities, loading: loadingDestinationCities } = useCitiesByUf(destinationState);

  const [originCityInput, setOriginCityInput] = useState(originCity);
  const [destinationCityInput, setDestinationCityInput] = useState(destinationCity);

  // Update input when props change
  useEffect(() => {
    setOriginCityInput(originCity);
  }, [originCity]);

  useEffect(() => {
    setDestinationCityInput(destinationCity);
  }, [destinationCity]);

  // Update values when input and data changes
  useEffect(() => {
    if (originCities.length && originState) {
      // Only set the city if it exists in the list
      const cityExists = originCities.some(city => city.nome.toLowerCase() === originCityInput.toLowerCase());
      if (cityExists) {
        updateField("originCity", originCityInput);
      }
    }
  }, [originCityInput, originCities]);

  useEffect(() => {
    if (destinationCities.length && destinationState) {
      // Only set the city if it exists in the list
      const cityExists = destinationCities.some(city => city.nome.toLowerCase() === destinationCityInput.toLowerCase());
      if (cityExists) {
        updateField("destinationCity", destinationCityInput);
      }
    }
  }, [destinationCityInput, destinationCities]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Localização</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <div className="space-y-4">
          <div>
            <Label className="font-medium">Origem</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div>
                <Label>Estado</Label>
                <select
                  value={originState}
                  onChange={(e) => updateField("originState", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 mt-1 bg-background"
                >
                  <option value="">Selecione</option>
                  {brazilianStates.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <Label>Cidade</Label>
                <div className="relative">
                  {originState ? (
                    <Combobox
                      options={originCities.map(city => ({
                        label: city.nome,
                        value: city.nome
                      }))}
                      value={originCityInput}
                      onChange={(value) => setOriginCityInput(value)}
                      placeholder={loadingOriginCities ? "Carregando..." : "Selecione uma cidade"}
                      disabled={!originState || loadingOriginCities}
                    />
                  ) : (
                    <Input
                      value={originCityInput}
                      onChange={(e) => setOriginCityInput(e.target.value)}
                      placeholder="Selecione um estado primeiro"
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="font-medium">Destino</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div>
                <Label>Estado</Label>
                <select
                  value={destinationState}
                  onChange={(e) => updateField("destinationState", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 mt-1 bg-background"
                >
                  <option value="">Selecione</option>
                  {brazilianStates.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <Label>Cidade</Label>
                <div className="relative">
                  {destinationState ? (
                    <Combobox
                      options={destinationCities.map(city => ({
                        label: city.nome,
                        value: city.nome
                      }))}
                      value={destinationCityInput}
                      onChange={(value) => setDestinationCityInput(value)}
                      placeholder={loadingDestinationCities ? "Carregando..." : "Selecione uma cidade"}
                      disabled={!destinationState || loadingDestinationCities}
                    />
                  ) : (
                    <Input
                      value={destinationCityInput}
                      onChange={(e) => setDestinationCityInput(e.target.value)}
                      placeholder="Selecione um estado primeiro"
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
