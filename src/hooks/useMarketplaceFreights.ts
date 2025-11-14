import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceFreight } from '@/types/marketplace';
import { toast } from 'sonner';

export const useMarketplaceFreights = (filters?: {
  status?: string;
  visibility?: string;
}) => {
  return useQuery({
    queryKey: ['marketplace-freights', filters],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_freights')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.visibility) {
        query = query.eq('visibility', filters.visibility);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MarketplaceFreight[];
    },
  });
};

export const useCreateMarketplaceFreight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (freight: Partial<MarketplaceFreight>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar company_id do usuário
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userRole?.company_id) throw new Error('Usuário não vinculado a empresa');

      const { data, error } = await supabase
        .from('marketplace_freights')
        .insert({
          ...freight,
          company_id: userRole.company_id,
          posted_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-freights'] });
      toast.success('Frete publicado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao publicar frete');
    },
  });
};

export const useUpdateMarketplaceFreight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketplaceFreight> & { id: string }) => {
      const { data, error } = await supabase
        .from('marketplace_freights')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-freights'] });
      toast.success('Frete atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar frete');
    },
  });
};
