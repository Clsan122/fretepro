import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Users, TrendingUp, DollarSign, Plus, Construction } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CompanyDashboard() {
  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel da Empresa</h1>
            <p className="text-muted-foreground">
              Gerencie seus fretes e motoristas
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Publicar Frete
          </Button>
        </div>

        <Alert>
          <Construction className="h-4 w-4" />
          <AlertDescription>
            O sistema está sincronizando com o banco de dados. As funcionalidades completas estarão disponíveis em breve.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fretes Ativos</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Negociação</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <TrendingUp className="h-10 w-10 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </Card>
        </div>

        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sistema em Configuração</h3>
          <p className="text-muted-foreground">
            A estrutura do marketplace foi criada no banco de dados. Aguarde alguns minutos para a sincronização completa.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
