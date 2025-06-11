
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const fetchUserProfile = async (userId: string): Promise<any | null> => {
  try {
    console.log('Buscando perfil do usuário:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    console.log('Perfil encontrado:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const fetchDriverData = async (userId: string): Promise<any | null> => {
  try {
    console.log('Buscando dados de motorista:', userId);
    
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching driver data:', error);
      return null;
    }
    
    console.log('Dados de motorista encontrados:', data);
    return data;
  } catch (error) {
    console.error('Error fetching driver data:', error);
    return null;
  }
};

export const transformUser = async (supabaseUser: SupabaseUser, profileData?: any): Promise<User> => {
  console.log('Transformando dados do usuário:', { supabaseUser, profileData });
  
  // Buscar dados de motorista se não estão disponíveis no profileData
  let driverData = null;
  if (!profileData?.license_plate) {
    driverData = await fetchDriverData(supabaseUser.id);
  }
  
  const user = {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profileData?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
    cpf: profileData?.cpf || supabaseUser.user_metadata?.cpf || '',
    phone: profileData?.phone || supabaseUser.user_metadata?.phone || '',
    address: profileData?.address || '',
    city: profileData?.city || '',
    state: profileData?.state || '',
    zipCode: profileData?.zip_code || '',
    pixKey: profileData?.pix_key || '',
    bankInfo: profileData?.bank_info || '',
    avatar: profileData?.avatar_url || '',
    
    // Dados de motorista
    isDriver: !!driverData || !!profileData?.license_plate,
    licensePlate: driverData?.license_plate || profileData?.license_plate || '',
    trailerPlate: driverData?.trailer_plate || profileData?.trailer_plate || '',
    vehicleType: driverData?.vehicle_type || profileData?.vehicle_type || '',
    bodyType: driverData?.body_type || profileData?.body_type || '',
    anttCode: driverData?.antt_code || profileData?.antt_code || '',
    vehicleYear: driverData?.vehicle_year || profileData?.vehicle_year || '',
    vehicleModel: driverData?.vehicle_model || profileData?.vehicle_model || '',
    
    createdAt: new Date(supabaseUser.created_at).toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Usuário transformado:', user);
  return user;
};
