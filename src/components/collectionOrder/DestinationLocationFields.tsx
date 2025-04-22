
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { getBrazilianCities } from "@/utils/cities";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface DestinationLocationFieldsProps {
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
}

export const DestinationLocationFields: React.FC<DestinationLocationFieldsProps> = ({
  destinationCity,
  setDestinationCity,
  destinationState,
  setDestinationState,
}) => {
  const [destinationCities, setDestinationCities] = useState<string[]>([]);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [destinationFilter, setDestinationFilter] = useState("");

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

  const getFilteredDestinationCities = () => {
    if (!destinationFilter.trim()) return destinationCities;
    return destinationCities.filter(city => city.toLowerCase().includes(destinationFilter.toLowerCase()));
  };

  const handleDestinationCitySelect = (city: string) => {
    setDestinationCity(city);
    setDestinationOpen(false);
  };

  return (
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
            <PopoverContent className="w-[300px] p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Buscar cidade..."
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="mb-2"
                />
              </div>
              <ScrollArea className="h-[200px]">
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
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
