import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'superadmin' | 'company_admin' | 'company_user' | 'driver' | 'shipper';

export const useUserRole = () => {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role, company_id, companies(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      
      return {
        roles: data?.map(r => r.role as AppRole) || [],
        companyId: data?.[0]?.company_id,
        company: data?.[0]?.companies,
        isPrimaryRole: (role: AppRole) => data?.some(r => r.role === role),
        hasRole: (role: AppRole) => data?.some(r => r.role === role),
        isSuperAdmin: data?.some(r => r.role === 'superadmin'),
        isCompanyAdmin: data?.some(r => r.role === 'company_admin'),
        isDriver: data?.some(r => r.role === 'driver'),
      };
    },
  });
};
