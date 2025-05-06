
import { useCallback, useEffect, useState } from "react";

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
      // Using Brasil API for better city data
      const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`;
      console.log(`Fetching cities for UF ${uf} from: ${url}`);
      
      const response = await fetch(url);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Erro ao buscar cidades para UF ${uf} (${response.status})`);
      }
      
      const data = await response.json();
      console.log(`Cities data received for ${uf}:`, data);
      
      if (Array.isArray(data)) {
        // Sort alphabetically by name
        const sorted = data
          .map((item) => ({
            nome: item.nome,
            codigo_ibge: item.codigo_ibge || "",
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        setCities(sorted);
      } else {
        // If data is not an array but response was OK, return empty array
        setCities([]);
        console.warn(`Dados recebidos para UF ${uf} não são um array:`, data);
      }
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
