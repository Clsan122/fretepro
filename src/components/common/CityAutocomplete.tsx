
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { BRAZILIAN_CITIES } from "@/utils/cities-data";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityAutocompleteProps {
  stateAbbreviation: string;
  value: string;
  onChange: (city: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  stateAbbreviation,
  value,
  onChange,
  label,
  placeholder = "Selecione a cidade...",
  disabled,
  autoComplete = "address-level2",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cities = useMemo(() => {
    if (!stateAbbreviation || stateAbbreviation === 'EX') return [];
    return BRAZILIAN_CITIES[stateAbbreviation] || [];
  }, [stateAbbreviation]);

  // Filtrar cidades conforme busca do usuário
  const filteredCities = useMemo(() => {
    if (!search) return cities;
    return cities.filter(city => city.toLowerCase().includes(search.toLowerCase()));
  }, [cities, search]);

  if (!stateAbbreviation || stateAbbreviation === "EX") {
    // Caso seja exterior, mostrar um input normal
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", disabled && "opacity-50")}
          disabled={disabled}
          type="button"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[220px] max-h-[280px] p-0 z-50">
        <Command>
          <CommandInput
            placeholder="Buscar cidade..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {filteredCities.map((city) => (
              <CommandItem
                key={city}
                value={city}
                onSelect={() => {
                  onChange(city);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn("mr-2 h-4 w-4", value === city ? "opacity-100" : "opacity-0")}
                />
                {city}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
