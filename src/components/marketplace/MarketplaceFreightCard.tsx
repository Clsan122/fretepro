import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketplaceFreight } from '@/types/marketplace';
import { MapPin, Package, Truck, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MarketplaceFreightCardProps {
  freight: MarketplaceFreight;
  onViewDetails: (freight: MarketplaceFreight) => void;
  onMakeBid?: (freight: MarketplaceFreight) => void;
  showBidButton?: boolean;
}

export const MarketplaceFreightCard = ({
  freight,
  onViewDetails,
  onMakeBid,
  showBidButton = true,
}: MarketplaceFreightCardProps) => {
  const statusColors = {
    open: 'bg-green-500',
    in_negotiation: 'bg-yellow-500',
    assigned: 'bg-blue-500',
    in_transit: 'bg-purple-500',
    completed: 'bg-gray-500',
    canceled: 'bg-red-500',
  };

  const statusLabels = {
    open: 'Aberto',
    in_negotiation: 'Em Negociação',
    assigned: 'Atribuído',
    in_transit: 'Em Trânsito',
    completed: 'Concluído',
    canceled: 'Cancelado',
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={statusColors[freight.status]}>
              {statusLabels[freight.status]}
            </Badge>
            {freight.price_negotiable && (
              <Badge variant="outline">Preço Negociável</Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-1">{freight.cargo_type}</h3>
          {freight.cargo_description && (
            <p className="text-sm text-muted-foreground">{freight.cargo_description}</p>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-green-500" />
          <span className="font-medium">Origem:</span>
          <span>{freight.origin_city}/{freight.origin_state}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="font-medium">Destino:</span>
          <span>{freight.destination_city}/{freight.destination_state}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4" />
          <span className="font-medium">Carga:</span>
          <span>{freight.weight}kg • {freight.volumes} volumes</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4" />
          <span className="font-medium">Veículo:</span>
          <span>{freight.vehicle_type}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Coleta:</span>
          <span>{format(new Date(freight.pickup_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium">Valor Sugerido:</span>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(freight.suggested_price)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(freight)}
        >
          Ver Detalhes
        </Button>
        {showBidButton && freight.status === 'open' && onMakeBid && (
          <Button 
            className="flex-1"
            onClick={() => onMakeBid(freight)}
          >
            Fazer Proposta
          </Button>
        )}
      </div>
    </Card>
  );
};
