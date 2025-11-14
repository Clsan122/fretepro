import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { useMarketplaceFreights } from '@/hooks/useMarketplaceFreights';
import { Package, Users, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { data: userRole } = useUserRole();
  const { data: companyFreights = [] } = useMarketplaceFreights();

  const stats = [
    {
      title: 'Fretes Ativos',
      value: companyFreights.filter(f => f.status === 'open').length,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Em Negociação',
      value: companyFreights.filter(f => f.status === 'in_negotiation').length,
      icon: TrendingUp,
      color: 'text-yellow-600',
    },
    {
      title: 'Concluídos',
      value: companyFreights.filter(f => f.status === 'completed').length,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Usuários',
      value: '-',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel da Empresa</h1>
            <p className="text-muted-foreground">
              {userRole?.company?.name || 'Empresa'}
            </p>
          </div>
          <Button onClick={() => navigate('/marketplace/post')}>
            <Plus className="mr-2 h-4 w-4" />
            Publicar Frete
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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

        {/* Recent Freights */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Fretes Recentes</h2>
          {companyFreights.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum frete publicado ainda</p>
              <Button onClick={() => navigate('/marketplace/post')} className="mt-4">
                Publicar Primeiro Frete
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {companyFreights.slice(0, 5).map((freight) => (
                <div key={freight.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{freight.cargo_type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {freight.origin_city} → {freight.destination_city}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
