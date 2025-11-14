import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Database } from '@/integrations/supabase/types';

type FreightStatus = Database['public']['Enums']['freight_status'];

export interface MarketplaceFreight {
  id: string;
  company_id: string;
  posted_by: string;
  status: FreightStatus;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  cargo_type: string;
  cargo_description: string | null;
  weight: number | null;
  volumes: number | null;
  vehicle_type: string | null;
  suggested_price: number | null;
  price_negotiable: boolean;
  pickup_date: string | null;
  delivery_deadline: string | null;
  contact_name: string;
  contact_phone: string;
  special_requirements: string | null;
  visibility: string;
  views_count: number;
  bids_count: number;
  created_at: string;
}

export const useMarketplaceFreights = (filters?: any) => {
  const [freights, setFreights] = useState<MarketplaceFreight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFreights = async () => {
    try {
      let query = supabase
        .from('marketplace_freights')
        .select('*')
        .eq('visibility', 'public')
        .in('status', ['open', 'in_negotiation'])
        .order('created_at', { ascending: false });

      if (filters?.origin_state) {
        query = query.eq('origin_state', filters.origin_state);
      }
      if (filters?.destination_state) {
        query = query.eq('destination_state', filters.destination_state);
      }
      if (filters?.cargo_type) {
        query = query.eq('cargo_type', filters.cargo_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFreights(data as MarketplaceFreight[]);
    } catch (error) {
      console.error('Error fetching marketplace freights:', error);
      toast.error('Erro ao carregar fretes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreights();
  }, [filters]);

  const createFreight = async (freightData: Omit<MarketplaceFreight, 'id' | 'created_at' | 'views_count' | 'bids_count'>) => {
    try {
      const { error } = await supabase
        .from('marketplace_freights')
        .insert([freightData]);

      if (error) throw error;

      toast.success('Frete publicado com sucesso');
      fetchFreights();
    } catch (error) {
      console.error('Error creating freight:', error);
      toast.error('Erro ao publicar frete');
    }
  };

  return { freights, loading, refetch: fetchFreights, createFreight };
};
