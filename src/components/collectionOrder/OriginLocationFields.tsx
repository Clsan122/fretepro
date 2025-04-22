
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

interface OriginLocationFieldsProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
}

export const OriginLocationFields: React.FC<OriginLocationFieldsProps> = ({
  originCity,
  setOriginCity,
  originState,
  setOriginState,
}) => {
  const [originCities, setOriginCities] = useState<string[]>([]);
  const [originOpen, setOriginOpen] = useState(false);
  const [originFilter, setOriginFilter] = useState("");

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

  const getFilteredOriginCities = () => {
    if (!originFilter.trim()) return originCities;
    return originCities.filter(city => city.toLowerCase().includes(originFilter.toLowerCase()));
  };

  const handleOriginCitySelect = (city: string) => {
    setOriginCity(city);
    setOriginOpen(false);
  };

  return (
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
            <PopoverContent className="w-[300px] p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Buscar cidade..."
                  value={originFilter}
                  onChange={(e) => setOriginFilter(e.target.value)}
                  className="mb-2"
                />
              </div>
              <ScrollArea className="h-[200px]">
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
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
