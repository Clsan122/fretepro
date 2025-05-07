
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useCitiesByUf, City } from "@/hooks/useCitiesByUf";

interface CitySelectAutocompleteProps {
  uf: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  autoComplete?: string;
}

export const CitySelectAutocomplete: React.FC<CitySelectAutocompleteProps> = ({
  uf,
  value,
  onChange,
  placeholder = "Digite a cidade",
  id,
  autoComplete
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { cities, loading } = useCitiesByUf(uf);
  
  // Atualiza o inputValue quando o valor externo muda
  useEffect(() => {
    setInputValue(value);
    setDebouncedInput(value);
  }, [value]);
  
  // Implementação de debounce para melhorar performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue]);
  
  // Filtra sugestões baseado no input com destaque para iniciais
  const filterSuggestions = (input: string): City[] => {
    if (!input.trim() || !cities || cities.length === 0) {
      return [];
    }
    
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return cities.filter(city => {
      const normalizedCityName = city.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedCityName.includes(normalizedInput);
    }).sort((a, b) => {
      // Prioriza cidades que começam com o input
      const aStarts = a.nome.toLowerCase().startsWith(input.toLowerCase());
      const bStarts = b.nome.toLowerCase().startsWith(input.toLowerCase());
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.nome.localeCompare(b.nome);
    });
  };
  
  const filteredSuggestions = filterSuggestions(debouncedInput);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    
    // Se o campo for limpo, propaga a mudança
    if (!value) {
      onChange("");
    }
  };
  
  const handleSuggestionClick = (cityName: string) => {
    setInputValue(cityName);
    onChange(cityName);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };
  
  // Caso UF seja Exterior, não mostra sugestões
  const isExterior = uf === 'EX';
  
  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => !isExterior && setShowSuggestions(true)}
        onBlur={() => {
          // Pequeno delay para permitir o clique nas sugestões
          setTimeout(() => setShowSuggestions(false), 200);
          
          // Se o valor for válido, propaga a mudança
          if (inputValue && inputValue !== value) {
            onChange(inputValue);
          }
        }}
      />
      
      {loading && (
        <div className="absolute z-50 w-full bg-background border border-input mt-1 rounded-md shadow-md">
          <div className="px-3 py-2 text-sm text-muted-foreground">Carregando...</div>
        </div>
      )}
      
      {showSuggestions && !isExterior && !loading && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-background border border-input mt-1 rounded-md shadow-md max-h-60 overflow-auto">
          {filteredSuggestions.slice(0, 15).map((city) => {
            // Destaca parte do texto correspondente ao input
            const cityName = city.nome;
            const index = cityName.toLowerCase().indexOf(inputValue.toLowerCase());
            
            return (
              <div
                key={city.codigo_ibge || city.nome}
                className="px-3 py-2 cursor-pointer hover:bg-accent text-sm"
                onMouseDown={() => handleSuggestionClick(city.nome)}
              >
                {index >= 0 ? (
                  <>
                    {cityName.substring(0, index)}
                    <span className="font-semibold bg-yellow-100 dark:bg-yellow-900/30">
                      {cityName.substring(index, index + inputValue.length)}
                    </span>
                    {cityName.substring(index + inputValue.length)}
                  </>
                ) : (
                  cityName
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
