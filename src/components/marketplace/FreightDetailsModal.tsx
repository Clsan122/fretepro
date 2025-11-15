import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Package, 
  Calendar, 
  DollarSign, 
  Truck,
  Building2,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FreightDetailsModalProps {
  freight: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBid: () => void;
  isDriver?: boolean;
}

export const FreightDetailsModal = ({ 
  freight, 
  open, 
  onOpenChange,
  onBid,
  isDriver = false
}: FreightDetailsModalProps) => {
  if (!freight) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes do Frete</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant={freight.status === 'open' ? 'default' : 'secondary'}>
              {freight.status === 'open' ? 'Aberto' : freight.status}
            </Badge>
            {freight.price_negotiable && (
              <Badge variant="outline">Preço Negociável</Badge>
            )}
          </div>

          {/* Rota */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Origem</span>
              </div>
              <p className="font-semibold">
                {freight.origin_city}, {freight.origin_state}
              </p>
              {freight.origin_address && (
                <p className="text-sm text-muted-foreground">{freight.origin_address}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Destino</span>
              </div>
              <p className="font-semibold">
                {freight.destination_city}, {freight.destination_state}
              </p>
              {freight.destination_address && (
                <p className="text-sm text-muted-foreground">{freight.destination_address}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações da Carga */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Informações da Carga
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Tipo de Carga</span>
                <p className="font-medium">{freight.cargo_type}</p>
              </div>
              {freight.cargo_description && (
                <div>
                  <span className="text-sm text-muted-foreground">Descrição</span>
                  <p className="font-medium">{freight.cargo_description}</p>
                </div>
              )}
              {freight.weight && (
                <div>
                  <span className="text-sm text-muted-foreground">Peso</span>
                  <p className="font-medium">{freight.weight} kg</p>
                </div>
              )}
              {freight.volumes && (
                <div>
                  <span className="text-sm text-muted-foreground">Volumes</span>
                  <p className="font-medium">{freight.volumes}</p>
                </div>
              )}
              {freight.dimensions && (
                <div>
                  <span className="text-sm text-muted-foreground">Dimensões</span>
                  <p className="font-medium">{freight.dimensions}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Veículo */}
          {freight.vehicle_type && (
            <>
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Veículo Necessário
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Tipo de Veículo</span>
                    <p className="font-medium">{freight.vehicle_type}</p>
                  </div>
                  {freight.body_type && (
                    <div>
                      <span className="text-sm text-muted-foreground">Carroceria</span>
                      <p className="font-medium">{freight.body_type}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Datas e Prazo */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Datas
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {freight.pickup_date && (
                <div>
                  <span className="text-sm text-muted-foreground">Data de Coleta</span>
                  <p className="font-medium">
                    {format(new Date(freight.pickup_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
              {freight.delivery_deadline && (
                <div>
                  <span className="text-sm text-muted-foreground">Prazo de Entrega</span>
                  <p className="font-medium">
                    {format(new Date(freight.delivery_deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Preço */}
          {freight.suggested_price && (
            <>
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Preço Sugerido
                </h3>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-primary">
                    R$ {freight.suggested_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {freight.price_negotiable && (
                    <Badge variant="outline">Negociável</Badge>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Requisitos Especiais */}
          {freight.special_requirements && (
            <>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Requisitos Especiais
                </h3>
                <p className="text-muted-foreground">{freight.special_requirements}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Contato da Empresa */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações de Contato
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{freight.contact_name}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{freight.contact_phone}</span>
              </div>
              {freight.contact_email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{freight.contact_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{freight.views_count || 0}</p>
                <p className="text-sm text-muted-foreground">Visualizações</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{freight.bids_count || 0}</p>
                <p className="text-sm text-muted-foreground">Propostas</p>
              </div>
              {freight.distance && (
                <div>
                  <p className="text-2xl font-bold">{freight.distance}</p>
                  <p className="text-sm text-muted-foreground">km</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA para motoristas */}
          {isDriver && (
            <Button 
              size="lg" 
              className="w-full"
              onClick={onBid}
            >
              Enviar Proposta
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
