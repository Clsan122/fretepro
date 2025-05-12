
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { getCollectionOrderById, deleteCollectionOrder, saveFreight, getClientById } from "@/utils/storage";
import { CollectionOrder, Freight, Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ActionButtons } from "@/components/collectionOrder/view/ActionButtons";
import { OrderHeader } from "@/components/collectionOrder/view/OrderHeader";
import { OrderContent } from "@/components/collectionOrder/view/OrderContent";
import { PrintStyles } from "@/components/collectionOrder/view/PrintStyles";
import { useCollectionOrderPdf } from "@/hooks/useCollectionOrderPdf";
import { v4 as uuidv4 } from "uuid";
import { IssuerHeaderDetails } from "@/components/collectionOrder/view/IssuerHeaderDetails";

const CollectionOrderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [issuer, setIssuer] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const { isGenerating, handleShare, handleDownload, handlePrint } = useCollectionOrderPdf(order, id);

  useEffect(() => {
    async function fetchOrder() {
      if (id) {
        try {
          const collectionOrder = await getCollectionOrderById(id);
          if (collectionOrder) {
            setOrder(collectionOrder);

            // Try to find issuer (user or client) by ID
            if (collectionOrder.issuerId) {
              // Procure por um client
              const clients = JSON.parse(localStorage.getItem("clients") || "[]");
              const matchingClient = clients.find((c: Client) => c.id === collectionOrder.issuerId);
              if (matchingClient) {
                setIssuer(matchingClient);
              } else {
                // É o usuário dono da ordem
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const emissionUser = users.find((u: any) => u.id === collectionOrder.issuerId);
                setIssuer(emissionUser || null);
              }
            }

            // Try to find client by matching recipient name with client name
            if (collectionOrder.recipient) {
              const clients = JSON.parse(localStorage.getItem("clients") || "[]");
              const matchingClient = clients.find((c: Client) => 
                c.name.toLowerCase() === collectionOrder.recipient.toLowerCase()
              );
              if (matchingClient) {
                setClient(matchingClient);
              }
            }
          } else {
            toast({
              title: "Erro",
              description: "Ordem de coleta não encontrada",
              variant: "destructive"
            });
            navigate("/collection-orders");
          }
        } catch (error) {
          console.error("Erro ao buscar ordem de coleta:", error);
          toast({
            title: "Erro",
            description: "Erro ao buscar ordem de coleta",
            variant: "destructive"
          });
          navigate("/collection-orders");
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchOrder();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (id) {
      await deleteCollectionOrder(id);
      toast({
        title: "Ordem de coleta excluída",
        description: "A ordem de coleta foi excluída com sucesso!"
      });
      navigate("/collection-orders");
    }
  };

  const handleGenerateFreight = () => {
    if (!order || !order.userId) return;

    // Create a new freight from the collection order
    const newFreight: Freight = {
      id: uuidv4(),
      clientId: client?.id || "", // Use client id if available
      originCity: order.originCity,
      originState: order.originState,
      departureDate: "",
      destinationCity: order.destinationCity,
      destinationState: order.destinationState,
      arrivalDate: "",
      volumes: order.volumes,
      weight: order.weight,
      dimensions: order.measurements.map(m => 
        `${m.length}x${m.width}x${m.height} (${m.quantity})`
      ).join(", "),
      cubicMeasurement: order.cubicMeasurement,
      cargoType: "general", // Default value
      vehicleType: "truck", // Default value
      freightValue: 0,
      dailyRate: 0,
      otherCosts: 0,
      tollCosts: 0,
      totalValue: 0,
      createdAt: new Date().toISOString(),
      userId: order.userId,
      driverId: order.driverId,
      // Add required properties with default values
      distance: 0,
      price: 0,
      status: 'pending',
      paymentStatus: 'pending',
      expenses: []
    };

    // Save the new freight
    saveFreight(newFreight);

    toast({
      title: "Frete gerado",
      description: "Um novo frete foi criado com base nesta ordem de coleta!"
    });

    // Navigate to the freights page
    navigate("/freights");
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/collection-orders")}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="p-4 md:p-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/collection-orders")}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Ordem não encontrada</h1>
          </div>
        </div>
      </Layout>
    );
  }

  const createdAt = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Layout>
      <div className="p-4 md:p-6 print-container">
        <ActionButtons
          id={id}
          onDelete={handleDelete}
          onShare={handleShare}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onGenerateFreight={handleGenerateFreight}
        />
        
        <PrintStyles />
        
        <div 
          id="collection-order-print" 
          ref={printRef}
          className={`bg-white rounded-lg p-6 shadow-md print:shadow-none print:p-0 print:m-0 ${isGenerating ? 'opacity-0 absolute' : ''}`}
        >
          <OrderHeader
            clientLogo={client?.logo}
            clientName={client?.name || order.recipient}
            createdAt={createdAt}
            issuer={issuer}
          />
          
          <OrderContent order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
