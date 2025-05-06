
import React, { useState, useEffect, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAZILIAN_CITIES } from "@/utils/cities-data";

interface CityAutocompleteProps {
  stateAbbreviation: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoComplete?: string; // Added autoComplete property to fix the type error
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  stateAbbreviation,
  value,
  onChange,
  placeholder = "Selecione a cidade",
  className,
  autoComplete, // Make sure to include it in the component props
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter cities based on the state abbreviation and search term
  const filteredCities = useMemo(() => {
    // Ensure we have a valid state and cities data
    if (!stateAbbreviation || !BRAZILIAN_CITIES[stateAbbreviation]) {
      return [];
    }

    const cities = BRAZILIAN_CITIES[stateAbbreviation] || [];
    
    if (searchTerm === "") {
      return cities;
    }
    
    return cities.filter((city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stateAbbreviation, searchTerm]);

  // Reset value when state changes
  useEffect(() => {
    if (value && stateAbbreviation && !filteredCities.includes(value)) {
      onChange("");
    }
  }, [stateAbbreviation]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          data-autocomplete={autoComplete} // Use the autoComplete property where appropriate
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar cidade..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {filteredCities.map((city) => (
              <CommandItem
                key={city}
                value={city}
                onSelect={() => {
                  onChange(city);
                  setOpen(false);
                  setSearchTerm("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city ? "opacity-100" : "opacity-0"
                  )}
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
