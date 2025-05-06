
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useLocationApi, City } from "@/hooks/useLocationApi";

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
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { getCitiesByState } = useLocationApi();
  
  // Atualiza o inputValue quando o valor externo muda
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Busca cidades quando o UF muda
  useEffect(() => {
    const loadCities = async () => {
      if (!uf || uf === 'EX') {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const citiesData = await getCitiesByState(uf);
        setSuggestions(citiesData || []); // Ensure we always have an array
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCities();
  }, [uf, getCitiesByState]);
  
  // Filtra sugestões baseado no input
  const filterSuggestions = (input: string): City[] => {
    if (!input.trim() || !suggestions || suggestions.length === 0) {
      return [];
    }
    
    return suggestions.filter(city => 
      city.nome.toLowerCase().includes(input.toLowerCase())
    );
  };
  
  const filteredSuggestions = filterSuggestions(inputValue);
  
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
  };
  
  // Caso UF seja Exterior, não mostra sugestões
  const isExterior = uf === 'EX';
  
  return (
    <div className="relative">
      <Input
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
          {filteredSuggestions.slice(0, 10).map((city) => (
            <div
              key={city.codigo_ibge || city.nome}
              className="px-3 py-2 cursor-pointer hover:bg-accent text-sm"
              onMouseDown={() => handleSuggestionClick(city.nome)}
            >
              {city.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
