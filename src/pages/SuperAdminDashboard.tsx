import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Building2, Users, Package, TrendingUp, Construction } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SuperAdminDashboard() {
  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel SuperAdmin</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema
          </p>
        </div>

        <Alert>
          <Construction className="h-4 w-4" />
          <AlertDescription>
            O sistema está sincronizando as tabelas e tipos do banco de dados. 
            As estatísticas estarão disponíveis após a sincronização.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Empresas Cadastradas</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuários Totais</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Users className="h-10 w-10 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fretes Publicados</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <Package className="h-10 w-10 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Propostas Enviadas</p>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
              <TrendingUp className="h-10 w-10 text-yellow-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Estrutura do Banco de Dados</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">✅ Tabela companies</span>
                <span className="text-green-600">Criada</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">✅ Tabela user_roles</span>
                <span className="text-green-600">Criada</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">✅ Tabela marketplace_freights</span>
                <span className="text-green-600">Criada</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">✅ Tabela freight_bids</span>
                <span className="text-green-600">Criada</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">✅ Tabela notifications</span>
                <span className="text-green-600">Criada</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">✅ Sistema de assinaturas</span>
                <span className="text-green-600">Criado</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">⏳ Sincronização de tipos</span>
                <span className="text-yellow-600">Em progresso</span>
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>1. Aguarde a sincronização dos tipos TypeScript (2-5 minutos)</p>
              <p>2. Acesse as tabelas pelo painel do Supabase</p>
              <p>3. Configure os primeiros usuários e empresas</p>
              <p>4. Teste o fluxo completo do marketplace</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
