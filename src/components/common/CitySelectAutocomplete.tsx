
import React, { useState, useEffect, useMemo } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useCitiesByUf } from "@/hooks/useCitiesByUf";

interface CitySelectAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  uf: string;
}

export const CitySelectAutocomplete: React.FC<CitySelectAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Digite para buscar a cidade",
  disabled = false,
  id,
  uf,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { cities, loading } = useCitiesByUf(uf);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Reset input value when UF changes
    if (uf) {
      setInputValue("");
    }
  }, [uf]);
  
  // Normalize text (remove accents and make lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filteredCities = useMemo(() => {
    if (!inputValue || inputValue.length < 1) {
      return showAll ? cities : [];
    }

    const normalizedInput = normalizeText(inputValue);
    
    return cities.filter(city => {
      const normalizedCity = normalizeText(city.nome);
      
      // Match by full name
      if (normalizedCity.includes(normalizedInput)) {
        return true;
      }
      
      // Match by initials
      const words = normalizedCity.split(' ');
      if (words.length > 1) {
        const initials = words.map(word => word[0]).join('');
        return initials.includes(normalizedInput);
      }
      
      return false;
    });
  }, [cities, inputValue, showAll]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Show all results when input is empty and user clicks on the field
    if (value.length === 0) {
      setShowAll(true);
    } else if (value.length > 0) {
      setShowAll(true);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue("");
    setOpen(false);
  };

  if (uf === 'EX') {
    // For foreign countries, use a regular input
    return (
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    );
  }

  return (
    <Command className="relative bg-background" shouldFilter={false}>
      <CommandInput
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        value={inputValue}
        onValueChange={handleInputChange}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
          }, 200);
        }}
        onFocus={() => setOpen(true)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
      {open && (
        <div className="absolute mt-1 w-full z-10">
          <CommandList className="max-h-52 overflow-y-auto rounded-md border bg-popover shadow-md">
            {loading ? (
              <CommandGroup>
                <CommandItem disabled>Carregando...</CommandItem>
              </CommandGroup>
            ) : filteredCities.length === 0 ? (
              <CommandEmpty>
                {uf ? "Nenhuma cidade encontrada" : "Selecione um estado primeiro"}
              </CommandEmpty>
            ) : (
              <>
                {filteredCities.map((city) => (
                  <CommandItem
                    key={city.codigo_ibge || city.nome}
                    value={city.nome}
                    onSelect={() => handleSelect(city.nome)}
                    className={cn("cursor-pointer", city.nome === value && "bg-accent text-accent-foreground")}
                  >
                    {city.nome}
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </div>
      )}
      {value && !open && (
        <div className="mt-1 flex items-center gap-1">
          <div className="rounded-md bg-secondary px-2 py-1 text-xs">
            {value}
            <button
              type="button"
              className="ml-1 text-secondary-foreground hover:text-destructive"
              onClick={() => onChange("")}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Command>
  );
};
