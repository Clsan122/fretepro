import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketplaceFreightCard } from '@/components/marketplace/MarketplaceFreightCard';
import { FreightBidDialog } from '@/components/marketplace/FreightBidDialog';
import { useMarketplaceFreights } from '@/hooks/useMarketplaceFreights';
import { useMyBids } from '@/hooks/useFreightBids';
import { MarketplaceFreight } from '@/types/marketplace';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Package, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';

export default function DriverDashboard() {
  const [selectedFreight, setSelectedFreight] = useState<MarketplaceFreight | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: marketplaceFreights = [], isLoading: isLoadingFreights } = useMarketplaceFreights({
    status: 'open',
    visibility: 'public',
  });

  const { data: myBids = [], isLoading: isLoadingBids } = useMyBids();

  const handleMakeBid = (freight: MarketplaceFreight) => {
    setSelectedFreight(freight);
    setBidDialogOpen(true);
  };

  const filteredFreights = marketplaceFreights.filter(freight =>
    freight.cargo_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freight.origin_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freight.destination_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Fretes Disponíveis',
      value: marketplaceFreights.length,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Minhas Propostas',
      value: myBids.length,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Pendentes',
      value: myBids.filter(b => b.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
    },
  ];

  const statusColors = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    withdrawn: 'bg-gray-500',
  };

  const statusLabels = {
    pending: 'Pendente',
    accepted: 'Aceita',
    rejected: 'Rejeitada',
    withdrawn: 'Retirada',
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel do Motorista</h1>
          <p className="text-muted-foreground">
            Encontre fretes disponíveis e gerencie suas propostas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Main Content */}
        <Tabs defaultValue="marketplace" className="space-y-4">
          <TabsList>
            <TabsTrigger value="marketplace">Fretes Disponíveis</TabsTrigger>
            <TabsTrigger value="my-bids">Minhas Propostas</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por tipo de carga, origem ou destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoadingFreights ? (
              <div className="text-center py-12">Carregando fretes...</div>
            ) : filteredFreights.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum frete disponível</h3>
                <p className="text-muted-foreground">
                  Não há fretes disponíveis no momento. Volte mais tarde!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFreights.map((freight) => (
                  <MarketplaceFreightCard
                    key={freight.id}
                    freight={freight}
                    onViewDetails={setSelectedFreight}
                    onMakeBid={handleMakeBid}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-bids" className="space-y-4">
            {isLoadingBids ? (
              <div className="text-center py-12">Carregando propostas...</div>
            ) : myBids.length === 0 ? (
              <Card className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma proposta enviada</h3>
                <p className="text-muted-foreground">
                  Comece fazendo propostas para fretes disponíveis!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid: any) => (
                  <Card key={bid.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className={statusColors[bid.status as keyof typeof statusColors]}>
                          {statusLabels[bid.status as keyof typeof statusLabels]}
                        </Badge>
                        <h3 className="text-lg font-semibold mt-2">
                          {bid.marketplace_freights?.cargo_type}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {bid.marketplace_freights?.origin_city} → {bid.marketplace_freights?.destination_city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Valor proposto</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(bid.proposed_price)}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Coleta estimada:</span>{' '}
                        {format(new Date(bid.estimated_pickup_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <p>
                        <span className="font-medium">Entrega estimada:</span>{' '}
                        {format(new Date(bid.estimated_delivery_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      {bid.message && (
                        <p className="mt-2 text-muted-foreground">
                          <span className="font-medium">Mensagem:</span> {bid.message}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <FreightBidDialog
          freight={selectedFreight}
          open={bidDialogOpen}
          onOpenChange={setBidDialogOpen}
        />
      </div>
    </Layout>
  );
}
