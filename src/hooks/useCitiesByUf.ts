
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
    if (!uf || uf === "EX") {
      setCities([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // ath API (request for dados-abertos-br and fallback to gov)
      const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov`;
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        // Sort alphabetically by name (A-Z)
        const sorted = data
          .map((item) => ({
            nome: item.nome,
            codigo_ibge: item.codigo_ibge || item.codigoIbge || undefined,
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        setCities(sorted);
      } else {
        setCities([]);
      }
    } catch (e) {
      setError("Erro ao buscar cidades");
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
