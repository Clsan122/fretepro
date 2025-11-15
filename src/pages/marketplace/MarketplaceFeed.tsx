import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarketplaceFreights } from "@/hooks/useMarketplaceFreights";
import { FreightDetailsModal } from "@/components/marketplace/FreightDetailsModal";
import { BidFormDialog } from "@/components/marketplace/BidFormDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2, MapPin, Package, Calendar, DollarSign, Search, Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const MarketplaceFeed = () => {
  const { freights, loading, refetch } = useMarketplaceFreights();
  const { role } = useUserRole();
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [selectedFreight, setSelectedFreight] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);

  const filteredFreights = freights.filter((freight) => {
    const originMatch = !searchOrigin || freight.origin_city.toLowerCase().includes(searchOrigin.toLowerCase());
    const destinationMatch = !searchDestination || freight.destination_city.toLowerCase().includes(searchDestination.toLowerCase());
    return originMatch && destinationMatch;
  });

  if (loading) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Marketplace de Fretes</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Filtrar por origem" value={searchOrigin} onChange={(e) => setSearchOrigin(e.target.value)} />
          <Input placeholder="Filtrar por destino" value={searchDestination} onChange={(e) => setSearchDestination(e.target.value)} />
        </div>
        <div className="grid gap-6">
          {filteredFreights.map((freight) => (
            <Card key={freight.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedFreight(freight); setShowDetails(true); }}>
              <CardContent className="p-6">
                <Badge>{freight.status}</Badge>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div><MapPin className="w-4 h-4 inline mr-2" />{freight.origin_city}, {freight.origin_state}</div>
                  <div><MapPin className="w-4 h-4 inline mr-2" />{freight.destination_city}, {freight.destination_state}</div>
                </div>
                {freight.suggested_price && <div className="mt-4"><DollarSign className="w-4 h-4 inline mr-2" />R$ {freight.suggested_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>}
                <Button className="mt-4">Ver Detalhes</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {selectedFreight && (
        <>
          <FreightDetailsModal freight={selectedFreight} open={showDetails} onOpenChange={setShowDetails} onBid={() => { setShowDetails(false); setShowBidForm(true); }} isDriver={role === 'driver'} />
          <BidFormDialog freight={selectedFreight} open={showBidForm} onOpenChange={setShowBidForm} onSuccess={refetch} />
        </>
      )}
    </Layout>
  );
};

export default MarketplaceFeed;
