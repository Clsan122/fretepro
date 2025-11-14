import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

export const useCompany = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('company_id')
          .eq('user_id', user.id)
          .single();

        if (userRole?.company_id) {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', userRole.company_id)
            .single();

          if (error) throw error;
          setCompany(data);
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [user]);

  const updateCompany = async (updates: Partial<Company>) => {
    if (!company) return;

    try {
      const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (error) throw error;

      setCompany({ ...company, ...updates });
      toast.success('Empresa atualizada com sucesso');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Erro ao atualizar empresa');
    }
  };

  const uploadDocument = async (file: File, documentType: string) => {
    if (!company) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}/${documentType}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erro ao fazer upload do documento');
      return null;
    }
  };

  return { company, loading, updateCompany, uploadDocument };
};
