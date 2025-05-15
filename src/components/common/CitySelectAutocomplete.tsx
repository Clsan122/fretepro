
import React, { useMemo, useState } from "react";
import { useBrazilCities } from "@/hooks/useBrazilCities";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CitySelectAutocompleteProps {
  uf: string;
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string; // Adicionando a propriedade className para resolver o erro
}

export const CitySelectAutocomplete: React.FC<CitySelectAutocompleteProps> = ({
  uf,
  value,
  onChange,
  placeholder = "Selecione a cidade",
  disabled,
  label,
  id,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const { cities, loading } = useBrazilCities(uf);

  // Filtrar cidades conforme busca do usuário
  const filteredCities = useMemo(() => {
    if (!filter.trim()) return cities;
    return cities.filter(city =>
      city.nome.toLowerCase().includes(filter.toLowerCase())
    );
  }, [cities, filter]);

  // Caso seja "EX", campo texto normal para informar país/cidade externa
  if (!uf || uf === "EX") {
    return (
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Informe a cidade ou país"
        disabled={disabled}
        className={className}
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
          className={cn("w-full justify-between", disabled && "opacity-50", className)}
          disabled={disabled}
        >
          {value || placeholder}
          <MapPin className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Buscar cidade..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {loading ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Carregando cidades...
            </div>
          ) : filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <Button
                key={city.codigo_ibge}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => { onChange(city.nome); setOpen(false); }}
              >
                {city.nome === value && <Check className="mr-2 h-4 w-4" />}
                {city.nome}
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
  );
};
