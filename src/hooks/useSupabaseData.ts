
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';

export interface UseSupabaseDataOptions {
  table: string;
  select?: string;
  filter?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
}

export const useSupabaseData = <T = any>({
  table,
  select = '*',
  filter = {},
  orderBy
}: UseSupabaseDataOptions) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados
  const fetchData = async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from(table)
        .select(select);

      // Aplicar filtros
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      // Aplicar ordenação
      if (orderBy) {
        query = query.order(orderBy.column, { 
          ascending: orderBy.ascending ?? true 
        });
      }

      const { data: fetchedData, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setData(fetchedData || []);
    } catch (err: any) {
      console.error(`Erro ao buscar dados da tabela ${table}:`, err);
      setError(err.message);
      toast({
        title: "Erro ao carregar dados",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar dados
  const saveData = async (item: Partial<T> & { id?: string }) => {
    if (!user) return null;

    try {
      const dataToSave = {
        ...item,
        user_id: user.id,
        sync_version: (item as any).sync_version ? (item as any).sync_version + 1 : 1
      };

      let result;
      
      if (item.id) {
        // Atualizar item existente
        const { data, error } = await supabase
          .from(table)
          .update(dataToSave)
          .eq('id', item.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Criar novo item
        const { data, error } = await supabase
          .from(table)
          .insert(dataToSave)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      // Atualizar estado local
      setData(prevData => {
        if (item.id) {
          return prevData.map(d => 
            (d as any).id === item.id ? result : d
          );
        } else {
          return [...prevData, result];
        }
      });

      toast({
        title: "Sucesso",
        description: `${item.id ? 'Atualizado' : 'Criado'} com sucesso!`,
      });

      return result;
    } catch (err: any) {
      console.error(`Erro ao salvar dados na tabela ${table}:`, err);
      toast({
        title: "Erro ao salvar",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Função para deletar dados
  const deleteData = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualizar estado local
      setData(prevData => prevData.filter(d => (d as any).id !== id));

      toast({
        title: "Sucesso",
        description: "Item deletado com sucesso!",
      });

      return true;
    } catch (err: any) {
      console.error(`Erro ao deletar dados da tabela ${table}:`, err);
      toast({
        title: "Erro ao deletar",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, [user, table, JSON.stringify(filter), JSON.stringify(orderBy)]);

  // Escutar eventos de sincronização
  useEffect(() => {
    const handleDataSync = (event: CustomEvent) => {
      const { table: syncTable, operation } = event.detail;
      
      if (syncTable === table) {
        // Recarregar dados quando houver mudanças
        fetchData();
      }
    };

    window.addEventListener('dataSync', handleDataSync as EventListener);
    
    return () => {
      window.removeEventListener('dataSync', handleDataSync as EventListener);
    };
  }, [table]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    saveData,
    deleteData
  };
};
