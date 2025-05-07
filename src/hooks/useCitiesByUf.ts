
import { useCallback, useEffect, useState } from "react";
import { BRAZILIAN_CITIES } from "@/utils/cities-data";

export interface City {
  nome: string;
  codigo_ibge: string;
}

export const useCitiesByUf = (uf: string) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    // Return empty array if uf is empty, null, undefined or "EX" (exterior)
    if (!uf || uf === "EX") {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Em um ambiente real, faríamos uma chamada à API
      // Mas para este exemplo, usaremos os dados previamente carregados
      const citiesForState = BRAZILIAN_CITIES[uf] || [];
      
      // Convertendo para o formato de City com codigo_ibge
      const formattedCities: City[] = citiesForState.map((cityName, index) => ({
        nome: cityName,
        codigo_ibge: `${uf}${index.toString().padStart(6, '0')}`
      }));
      
      // Ordenar alfabeticamente
      const sorted = formattedCities.sort((a, b) => 
        a.nome.localeCompare(b.nome, "pt-BR")
      );
      
      setCities(sorted);
    } catch (e: any) {
      setError(e.message || "Erro ao buscar cidades");
      console.error(`Erro ao buscar cidades para UF ${uf}:`, e);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [uf]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, loading, error };
};
