
import { supabase } from '@/integrations/supabase/client';
import { User, Client, Driver, Freight, CollectionOrder } from '@/types';

// Serviço para clientes
export const clientService = {
  async getAll(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(client: Omit<Client, 'id'>, userId: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...client, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, client: Partial<Client>, userId: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Serviço para motoristas
export const driverService = {
  async getAll(userId: string): Promise<Driver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(driver: Omit<Driver, 'id'>, userId: string): Promise<Driver> {
    const { data, error } = await supabase
      .from('drivers')
      .insert({ ...driver, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, driver: Partial<Driver>, userId: string): Promise<Driver> {
    const { data, error } = await supabase
      .from('drivers')
      .update(driver)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Serviço para fretes
export const freightService = {
  async getAll(userId: string): Promise<Freight[]> {
    const { data, error } = await supabase
      .from('freights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(freight: Omit<Freight, 'id'>, userId: string): Promise<Freight> {
    const { data, error } = await supabase
      .from('freights')
      .insert({ ...freight, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, freight: Partial<Freight>, userId: string): Promise<Freight> {
    const { data, error } = await supabase
      .from('freights')
      .update(freight)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('freights')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Serviço para ordens de coleta
export const collectionOrderService = {
  async getAll(userId: string): Promise<CollectionOrder[]> {
    const { data, error } = await supabase
      .from('collection_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(order: Omit<CollectionOrder, 'id'>, userId: string): Promise<CollectionOrder> {
    const { data, error } = await supabase
      .from('collection_orders')
      .insert({ ...order, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, order: Partial<CollectionOrder>, userId: string): Promise<CollectionOrder> {
    const { data, error } = await supabase
      .from('collection_orders')
      .update(order)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('collection_orders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Serviço para perfil do usuário
export const profileService = {
  async get(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(userId: string, profile: any): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...profile, id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
