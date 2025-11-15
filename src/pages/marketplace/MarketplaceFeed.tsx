import { useState } from "react";
import { useMarketplaceFreights } from "@/hooks/useMarketplaceFreights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MapPin, Package, Calendar, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketplaceFeed = () => {
  const navigate = useNavigate();
  const { freights, loading } = useMarketplaceFreights();
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");

  const publicFreights = freights.filter(f => f.visibility === "public" && f.status === "open");

  const filteredFreights = publicFreights.filter((freight) => {
    const matchesOrigin = !searchOrigin || 
      freight.origin_city.toLowerCase().includes(searchOrigin.toLowerCase()) ||
      freight.origin_state.toLowerCase().includes(searchOrigin.toLowerCase());
    
    const matchesDestination = !searchDestination || 
      freight.destination_city.toLowerCase().includes(searchDestination.toLowerCase()) ||
      freight.destination_state.toLowerCase().includes(searchDestination.toLowerCase());

    return matchesOrigin && matchesDestination;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Marketplace de Fretes</h1>
        <p className="text-muted-foreground">Encontre fretes disponíveis e envie suas propostas</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Fretes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origem</label>
              <Input
                placeholder="Cidade ou Estado"
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destino</label>
              <Input
                placeholder="Cidade ou Estado"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fretes */}
      <div className="space-y-4">
        {filteredFreights.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum frete encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFreights.map((freight) => (
            <Card 
              key={freight.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/marketplace/${freight.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">
                        {freight.origin_city}/{freight.origin_state} → {freight.destination_city}/{freight.destination_state}
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {freight.cargo_type}
                      {freight.weight && ` • ${freight.weight} kg`}
                      {freight.volumes && ` • ${freight.volumes} volumes`}
                    </CardDescription>
                  </div>
                  <Badge variant={freight.price_negotiable ? "secondary" : "default"}>
                    {freight.price_negotiable ? "Negociável" : "Preço Fixo"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Descrição da Carga */}
                {freight.cargo_description && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {freight.cargo_description}
                    </p>
                  </div>
                )}

                {/* Detalhes */}
                <div className="grid gap-4 md:grid-cols-2">
                  {freight.pickup_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Coleta:</span>
                      <span className="font-medium">
                        {new Date(freight.pickup_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {freight.delivery_deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Entrega até:</span>
                      <span className="font-medium">
                        {new Date(freight.delivery_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {freight.vehicle_type && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Veículo:</span>
                      <span className="font-medium">{freight.vehicle_type}</span>
                    </div>
                  )}

                </div>

                {/* Preço e Ação */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preço Sugerido</p>
                      <p className="text-2xl font-bold">
                        {freight.suggested_price ? `R$ ${freight.suggested_price.toFixed(2)}` : "A combinar"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{freight.bids_count || 0} propostas</p>
                      <p className="text-xs text-muted-foreground">{freight.views_count || 0} visualizações</p>
                    </div>
                    <Button>
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketplaceFeed;
