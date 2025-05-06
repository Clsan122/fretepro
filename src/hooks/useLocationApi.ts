
import { useState, useEffect } from "react";

export interface Region {
  id: number;
  sigla: string;
  nome: string;
}

export interface State {
  id: number;
  sigla: string;
  nome: string;
  regiao: Region;
}

export interface City {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: State;
    };
  };
}

export const useLocationApi = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar estados');
        }
        
        const data = await response.json();
        setStates(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar estados');
        console.error('Erro ao buscar estados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const getCitiesByState = async (uf: string) => {
    if (!uf || uf === 'EX') {
      return [];
    }

    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
      
      if (!response.ok) {
        throw new Error(`Falha ao buscar cidades para UF ${uf}`);
      }
      
      const data = await response.json();
      return data as City[];
    } catch (err: any) {
      console.error(`Erro ao buscar cidades para UF ${uf}:`, err);
      return [];
    }
  };

  return { states, getCitiesByState, loading, error };
};
