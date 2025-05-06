
import React, { useState, useEffect, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocationApi, City } from "@/hooks/useLocationApi";

interface CityAutocompleteProps {
  stateAbbreviation: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  stateAbbreviation,
  value,
  onChange,
  placeholder = "Selecione a cidade",
  className,
  autoComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const { getCitiesByState } = useLocationApi();

  useEffect(() => {
    const fetchCities = async () => {
      if (!stateAbbreviation || stateAbbreviation === "EX") {
        setCities([]);
        return;
      }

      setLoading(true);
      try {
        const citiesData = await getCitiesByState(stateAbbreviation);
        setCities(citiesData || []);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [stateAbbreviation, getCitiesByState]);

  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!cities || cities.length === 0) {
      return [];
    }

    if (searchTerm === "") {
      return cities;
    }

    return cities.filter((city) =>
      city.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, searchTerm]);

  // Reset value when state changes
  useEffect(() => {
    if (value && stateAbbreviation && cities.length > 0) {
      const cityExists = cities.some(city => city.nome === value);
      if (!cityExists) {
        onChange("");
      }
    }
  }, [stateAbbreviation, cities, value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          data-autocomplete={autoComplete}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar cidade..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {loading ? "Carregando cidades..." : "Nenhuma cidade encontrada."}
          </CommandEmpty>
          {filteredCities.length > 0 && (
            <CommandGroup className="max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <CommandItem
                  key={city.codigo_ibge || city.nome}
                  value={city.nome}
                  onSelect={() => {
                    onChange(city.nome);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.nome ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
