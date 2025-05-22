
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Helper function to transform Supabase User to our App User type
export const transformUser = (supabaseUser: SupabaseUser | null, userMetadata: any = {}): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || userMetadata?.full_name || '',
    cpf: userMetadata?.cpf || '',
    phone: userMetadata?.phone || '',
    avatar: userMetadata?.avatar_url || '', 
    address: userMetadata?.address || '',
    city: userMetadata?.city || '',
    state: userMetadata?.state || '',
    zipCode: userMetadata?.zip_code || '',
    companyName: userMetadata?.company_name || '',
    cnpj: userMetadata?.cnpj || '',
    companyLogo: userMetadata?.company_logo || '',
    pixKey: userMetadata?.pix_key || '',
    bankInfo: userMetadata?.bank_info || '',
    role: userMetadata?.role || 'user',
    createdAt: supabaseUser.created_at,
    updatedAt: userMetadata?.updated_at,
  };
};

// Fetch user profile data from Supabase
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception fetching user profile:', err);
    return null;
  }
};
