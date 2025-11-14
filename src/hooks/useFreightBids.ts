import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FreightBid } from '@/types/marketplace';
import { toast } from 'sonner';

export const useFreightBids = (freightId?: string) => {
  return useQuery({
    queryKey: ['freight-bids', freightId],
    queryFn: async () => {
      let query = supabase
        .from('freight_bids')
        .select('*, drivers(*)')
        .order('created_at', { ascending: false });

      if (freightId) {
        query = query.eq('freight_id', freightId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!freightId,
  });
};

export const useMyBids = () => {
  return useQuery({
    queryKey: ['my-bids'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('freight_bids')
        .select('*, marketplace_freights(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateFreightBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bid: Omit<FreightBid, 'id' | 'created_at' | 'updated_at' | 'status' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('freight_bids')
        .insert({
          ...bid,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight-bids'] });
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
      toast.success('Proposta enviada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar proposta');
    },
  });
};

export const useAcceptBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bidId, freightId }: { bidId: string; freightId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Atualizar bid para accepted
      const { error: bidError } = await supabase
        .from('freight_bids')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: user.id,
        })
        .eq('id', bidId);

      if (bidError) throw bidError;

      // Atualizar freight para assigned
      const { error: freightError } = await supabase
        .from('marketplace_freights')
        .update({ status: 'assigned' })
        .eq('id', freightId);

      if (freightError) throw freightError;

      return { bidId, freightId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight-bids'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-freights'] });
      toast.success('Proposta aceita com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao aceitar proposta');
    },
  });
};
