import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Building2, Users, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    companies: 0,
    pendingApprovals: 0,
    users: 0,
    freights: 0,
    bids: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [companiesRes, pendingRes, usersRes, freightsRes, bidsRes] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }),
        supabase.from('companies').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('marketplace_freights').select('id', { count: 'exact', head: true }),
        supabase.from('freight_bids').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        companies: companiesRes.count || 0,
        pendingApprovals: pendingRes.count || 0,
        users: usersRes.count || 0,
        freights: freightsRes.count || 0,
        bids: bidsRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel SuperAdmin</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema
          </p>
        </div>

        {stats.pendingApprovals > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Você tem {stats.pendingApprovals} empresa(s) aguardando aprovação.
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/superadmin/approvals')}
              >
                Ver Solicitações
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Empresas Cadastradas</p>
                <p className="text-3xl font-bold mt-2">{loading ? '-' : stats.companies}</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Totais</p>
                <p className="text-3xl font-bold mt-2">{loading ? '-' : stats.users}</p>
              </div>
              <Users className="h-10 w-10 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fretes Publicados</p>
                <p className="text-3xl font-bold mt-2">{loading ? '-' : stats.freights}</p>
              </div>
              <Package className="h-10 w-10 text-purple-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Propostas Enviadas</p>
                <p className="text-3xl font-bold mt-2">{loading ? '-' : stats.bids}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-yellow-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/superadmin/approvals')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Gerenciar Aprovações de Empresas
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/marketplace')}
              >
                <Package className="mr-2 h-4 w-4" />
                Ver Marketplace de Fretes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Status do Sistema</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Sistema de Empresas</span>
                <span className="text-green-600">✓ Ativo</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Sistema de Roles</span>
                <span className="text-green-600">✓ Ativo</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Marketplace</span>
                <span className="text-green-600">✓ Ativo</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Sistema de Propostas</span>
                <span className="text-green-600">✓ Ativo</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Notificações</span>
                <span className="text-green-600">✓ Ativo</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Assinaturas</span>
                <span className="text-green-600">✓ Ativo</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
