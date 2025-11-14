import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, Package, TrendingUp } from 'lucide-react';

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['superadmin-stats'],
    queryFn: async () => {
      const [companiesRes, usersRes, freightsRes, bidsRes] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('marketplace_freights').select('*', { count: 'exact', head: true }),
        supabase.from('freight_bids').select('*', { count: 'exact', head: true }),
      ]);

      return {
        companies: companiesRes.count || 0,
        users: usersRes.count || 0,
        freights: freightsRes.count || 0,
        bids: bidsRes.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: 'Empresas Cadastradas',
      value: stats?.companies || 0,
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Usuários Totais',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Fretes Publicados',
      value: stats?.freights || 0,
      icon: Package,
      color: 'text-purple-600',
    },
    {
      title: 'Propostas Enviadas',
      value: stats?.bids || 0,
      icon: TrendingUp,
      color: 'text-yellow-600',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel SuperAdmin</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Carregando estatísticas...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Empresas Recentes</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
