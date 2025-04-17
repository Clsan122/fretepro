
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

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

export const LocationsSection: React.FC<LocationsProps> = ({
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
}) => {
  const [originCities, setOriginCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);
  const [originCityOpen, setOriginCityOpen] = useState(false);
  const [destinationCityOpen, setDestinationCityOpen] = useState(false);

  const stateOptions = [
    { abbreviation: "EX", name: "Exterior (Exportação)" },
    ...BRAZILIAN_STATES
  ];
  
  useEffect(() => {
    if (originState && originState !== "EX") {
      const cities = getBrazilianCities(originState);
      setOriginCities(cities);
    } else {
      setOriginCities([]);
    }
  }, [originState]);
  
  useEffect(() => {
    if (destinationState && destinationState !== "EX") {
      const cities = getBrazilianCities(destinationState);
      setDestinationCities(cities);
    } else {
      setDestinationCities([]);
    }
  }, [destinationState]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Localização</CardTitle>
        <CardDescription>Informe os dados de origem e destino</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Origem</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="originState">Estado</Label>
                <Select
                  value={originState}
                  onValueChange={(value) => {
                    setOriginState(value);
                    setOriginCity("");
                  }}
                >
                  <SelectTrigger id="originState">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state.abbreviation} value={state.abbreviation}>
                        {state.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="originCity">Cidade</Label>
                {originState === "EX" ? (
                  <Input
                    id="originCity"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Cidade de origem"
                  />
                ) : (
                  <Popover open={originCityOpen} onOpenChange={setOriginCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={originCityOpen}
                        className="w-full justify-between"
                        disabled={!originState || originState === "EX"}
                      >
                        {originCity || "Selecione a cidade..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cidade..." />
                        <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {originCities.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={(currentValue) => {
                                setOriginCity(currentValue);
                                setOriginCityOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  originCity === city ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Destino</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="destinationState">Estado</Label>
                <Select
                  value={destinationState}
                  onValueChange={(value) => {
                    setDestinationState(value);
                    setDestinationCity("");
                  }}
                >
                  <SelectTrigger id="destinationState">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state.abbreviation} value={state.abbreviation}>
                        {state.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="destinationCity">Cidade</Label>
                {destinationState === "EX" ? (
                  <Input
                    id="destinationCity"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="Cidade de destino"
                  />
                ) : (
                  <Popover open={destinationCityOpen} onOpenChange={setDestinationCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={destinationCityOpen}
                        className="w-full justify-between"
                        disabled={!destinationState || destinationState === "EX"}
                      >
                        {destinationCity || "Selecione a cidade..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cidade..." />
                        <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {destinationCities.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={(currentValue) => {
                                setDestinationCity(currentValue);
                                setDestinationCityOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  destinationCity === city ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="receiver">Recebedor / Destinatário</Label>
            <Input
              id="receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Nome de quem vai receber a mercadoria no destino"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receiverAddress">Endereço do Destinatário</Label>
            <Input
              id="receiverAddress"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="Endereço completo do destinatário"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
