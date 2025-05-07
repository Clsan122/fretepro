
import { useCallback, useEffect, useState } from "react";

export interface BrazilCity {
  nome: string;
  codigo_ibge: string;
}

export const useBrazilCities = (uf: string) => {
  const [cities, setCities] = useState<BrazilCity[]>([]);
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
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar cidades: ${response.status}`);
      }
      
      const data: BrazilCity[] = await response.json();
      
      // Ordenar alfabeticamente
      const sorted = data.sort((a, b) => 
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
