import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Package, TrendingUp, Clock, Construction } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DriverDashboard() {
  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel do Motorista</h1>
          <p className="text-muted-foreground">
            Encontre fretes disponíveis e gerencie suas propostas
          </p>
        </div>

        <Alert>
          <Construction className="h-4 w-4" />
          <AlertDescription>
            O sistema está sincronizando com o banco de dados. Os dados do marketplace estarão disponíveis em breve.
          </AlertDescription>
        </Alert>

        {/* Stats Cards Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fretes Disponíveis</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Minhas Propostas</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </Card>
        </div>

        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Marketplace em Configuração</h3>
          <p className="text-muted-foreground">
            A funcionalidade completa do marketplace estará disponível assim que o sistema terminar a sincronização.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
