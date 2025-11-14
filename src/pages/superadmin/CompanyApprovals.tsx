import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';
import { CompanyApprovalCard } from '@/components/superadmin/CompanyApprovalCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const CompanyApprovals = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const pendingCompanies = companies.filter(c => c.status === 'pending_approval');
  const approvedCompanies = companies.filter(c => c.status === 'active');
  const rejectedCompanies = companies.filter(c => c.status === 'rejected');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aprovações de Empresas</h1>
        <p className="text-muted-foreground">Gerencie os cadastros pendentes de aprovação</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pendentes ({pendingCompanies.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Aprovadas ({approvedCompanies.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejeitadas ({rejectedCompanies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingCompanies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma empresa pendente de aprovação
              </CardContent>
            </Card>
          ) : (
            pendingCompanies.map(company => (
              <CompanyApprovalCard
                key={company.id}
                company={company}
                onUpdate={fetchCompanies}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedCompanies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma empresa aprovada ainda
              </CardContent>
            </Card>
          ) : (
            approvedCompanies.map(company => (
              <CompanyApprovalCard
                key={company.id}
                company={company}
                onUpdate={fetchCompanies}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedCompanies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma empresa rejeitada
              </CardContent>
            </Card>
          ) : (
            rejectedCompanies.map(company => (
              <CompanyApprovalCard
                key={company.id}
                company={company}
                onUpdate={fetchCompanies}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyApprovals;
