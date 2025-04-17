import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { getBrazilianCities } from "@/utils/cities";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface LocationsProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
}

export const LocationsSection: React.FC<LocationsProps> = (props) => {
  const {
    originCity,
    setOriginCity,
    originState,
    setOriginState,
    destinationCity,
    setDestinationCity,
    destinationState,
    setDestinationState,
    receiver,
    setReceiver,
    receiverAddress,
    setReceiverAddress
  } = props;

  const [originCities, setOriginCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);
  
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  useEffect(() => {
    if (originState === 'EX') {
      setOriginCities([]);
    } else if (originState) {
      const cities = getBrazilianCities(originState);
      setOriginCities(cities);
    } else {
      setOriginCities([]);
    }
  }, [originState]);

  useEffect(() => {
    if (destinationState === 'EX') {
      setDestinationCities([]);
    } else if (destinationState) {
      const cities = getBrazilianCities(destinationState);
      setDestinationCities(cities);
    } else {
      setDestinationCities([]);
    }
  }, [destinationState]);

  const getFilteredOriginCities = () => {
    if (!originFilter.trim()) return originCities.slice(0, 100);
    return originCities
      .filter(city => city.toLowerCase().includes(originFilter.toLowerCase()))
      .slice(0, 100);
  };
  
  const getFilteredDestinationCities = () => {
    if (!destinationFilter.trim()) return destinationCities.slice(0, 100);
    return destinationCities
      .filter(city => city.toLowerCase().includes(destinationFilter.toLowerCase()))
      .slice(0, 100);
  };

  const handleOriginCitySelect = (city: string) => {
    setOriginCity(city);
    setOriginOpen(false);
  };
  
  const handleDestinationCitySelect = (city: string) => {
    setDestinationCity(city);
    setDestinationOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localidades</CardTitle>
        <CardDescription>Informe a origem e destino da carga</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="originState">Estado de Origem</Label>
              <Select 
                value={originState} 
                onValueChange={(value) => {
                  setOriginState(value);
                  setOriginCity("");
                }}
              >
                <SelectTrigger id="originState">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EX">Exterior</SelectItem>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="originCity">
                {originState === 'EX' ? 'País de Origem' : 'Cidade de Origem'}
              </Label>
              {originState === 'EX' ? (
                <Input
                  id="originCity"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  placeholder="Digite o país de origem"
                />
              ) : (
                <Popover open={originOpen} onOpenChange={setOriginOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      role="combobox" 
                      aria-expanded={originOpen}
                      className="w-full justify-between"
                      disabled={!originState}
                    >
                      {originCity || "Selecione a cidade"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Buscar cidade..."
                        value={originFilter}
                        onChange={(e) => setOriginFilter(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {getFilteredOriginCities().length > 0 ? (
                        getFilteredOriginCities().map((city) => (
                          <Button
                            key={city}
                            variant="ghost"
                            className="w-full justify-start text-left"
                            onClick={() => handleOriginCitySelect(city)}
                          >
                            {city === originCity && <Check className="mr-2 h-4 w-4" />}
                            {city}
                          </Button>
                        ))
                      ) : (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          Nenhuma cidade encontrada
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destinationState">Estado de Destino</Label>
              <Select 
                value={destinationState} 
                onValueChange={(value) => {
                  setDestinationState(value);
                  setDestinationCity("");
                }}
              >
                <SelectTrigger id="destinationState">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EX">Exterior</SelectItem>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationCity">
                {destinationState === 'EX' ? 'País de Destino' : 'Cidade de Destino'}
              </Label>
              {destinationState === 'EX' ? (
                <Input
                  id="destinationCity"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="Digite o país de destino"
                />
              ) : (
                <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      role="combobox" 
                      aria-expanded={destinationOpen}
                      className="w-full justify-between"
                      disabled={!destinationState}
                    >
                      {destinationCity || "Selecione a cidade"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Buscar cidade..."
                        value={destinationFilter}
                        onChange={(e) => setDestinationFilter(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {getFilteredDestinationCities().length > 0 ? (
                        getFilteredDestinationCities().map((city) => (
                          <Button
                            key={city}
                            variant="ghost"
                            className="w-full justify-start text-left"
                            onClick={() => handleDestinationCitySelect(city)}
                          >
                            {city === destinationCity && <Check className="mr-2 h-4 w-4" />}
                            {city}
                          </Button>
                        ))
                      ) : (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          Nenhuma cidade encontrada
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <Label htmlFor="receiver">Recebedor</Label>
          <Input
            id="receiver"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Nome do recebedor"
          />
        </div>
        
        <div className="mt-4 space-y-2">
          <Label htmlFor="receiverAddress">Endereço do Recebedor</Label>
          <Input
            id="receiverAddress"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Endereço de entrega"
          />
        </div>
      </CardContent>
    </Card>
  );
};
