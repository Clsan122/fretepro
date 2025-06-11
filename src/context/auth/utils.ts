
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const fetchUserProfile = async (userId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const transformUser = (supabaseUser: SupabaseUser, profileData?: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profileData?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
    cpf: profileData?.cpf || supabaseUser.user_metadata?.cpf || '',
    phone: profileData?.phone || supabaseUser.user_metadata?.phone || '',
    address: profileData?.address || '',
    city: profileData?.city || '',
    state: profileData?.state || '',
    zipCode: profileData?.zip_code || '',
    companyName: profileData?.company_name || '',
    cnpj: profileData?.cnpj || '',
    pixKey: profileData?.pix_key || '',
    bankInfo: profileData?.bank_info || '',
    avatar: profileData?.avatar_url || '',
    createdAt: new Date(supabaseUser.created_at).toISOString(),
    updatedAt: new Date().toISOString()
  };
};
