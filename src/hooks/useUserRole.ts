import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoleCheck, AppRole } from '@/types/roles';
import { useAuth } from '@/context/auth';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roleCheck, setRoleCheck] = useState<RoleCheck>({
    isSuperAdmin: false,
    isCompanyAdmin: false,
    isCompanyUser: false,
    isDriver: false,
    isShipper: false,
    role: null,
    companyId: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, company_id, companies(*)')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setRoleCheck({
            isSuperAdmin: data.role === 'superadmin',
            isCompanyAdmin: data.role === 'company_admin',
            isCompanyUser: data.role === 'company_user',
            isDriver: data.role === 'driver',
            isShipper: data.role === 'shipper',
            role: data.role as AppRole,
            companyId: data.company_id,
          });
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { ...roleCheck, loading };
};
