import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';

export interface FreightBid {
  id: string;
  freight_id: string;
  driver_id: string;
  user_id: string;
  proposed_price: number;
  estimated_pickup_date: string | null;
  estimated_delivery_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export const useFreightBids = (freightId?: string) => {
  const { user } = useAuth();
  const [bids, setBids] = useState<FreightBid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = async () => {
    if (!freightId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('freight_bids')
        .select('*')
        .eq('freight_id', freightId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [freightId]);

  const createBid = async (bidData: { freight_id: string; driver_id: string; proposed_price: number; estimated_pickup_date?: string; estimated_delivery_date?: string; message?: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('freight_bids')
        .insert([{ ...bidData, user_id: user.id }]);

      if (error) throw error;

      toast.success('Proposta enviada com sucesso');
      fetchBids();
    } catch (error) {
      console.error('Error creating bid:', error);
      toast.error('Erro ao enviar proposta');
    }
  };

  const acceptBid = async (bidId: string) => {
    try {
      const { error } = await supabase
        .from('freight_bids')
        .update({ status: 'accepted', accepted_at: new Date().toISOString(), accepted_by: user?.id })
        .eq('id', bidId);

      if (error) throw error;

      toast.success('Proposta aceita');
      fetchBids();
    } catch (error) {
      console.error('Error accepting bid:', error);
      toast.error('Erro ao aceitar proposta');
    }
  };

  const rejectBid = async (bidId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('freight_bids')
        .update({ status: 'rejected', rejected_at: new Date().toISOString(), rejection_reason: reason })
        .eq('id', bidId);

      if (error) throw error;

      toast.success('Proposta rejeitada');
      fetchBids();
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast.error('Erro ao rejeitar proposta');
    }
  };

  return { bids, loading, createBid, acceptBid, rejectBid, refetch: fetchBids };
};
