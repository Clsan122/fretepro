
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getCollectionOrdersByUserId } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Truck } from "lucide-react";
import { toast } from "sonner";

const CollectionOrders: React.FC = () => {
  const [orders, setOrders] = useState<CollectionOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoading(true);
          const userOrders = await getCollectionOrdersByUserId(user.id);
          setOrders(userOrders);
        } catch (error) {
          console.error("Erro ao buscar ordens de coleta:", error);
          toast.error("Erro ao carregar ordens de coleta");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold mb-4">Ordens de Coleta</h1>
          <Button 
            onClick={() => navigate("/collection-order/new")}
            className="bg-freight-600 hover:bg-freight-700 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Ordem
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-t-freight-600 border-freight-200 rounded-full animate-spin"></div>
            <span className="ml-2 text-freight-600">Carregando...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ordem de coleta encontrada</h3>
            <p className="text-gray-500 mb-6">Comece criando sua primeira ordem de coleta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/collection-order/view/${order.id}`)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg mb-1">
                        {order.sender} → {order.recipient}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {order.originCity}/{order.originState} para {order.destinationCity}/{order.destinationState}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Truck className="h-4 w-4 mr-1" />
                        {order.driverName || "Sem motorista"}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs mt-1 px-2 py-1 bg-freight-100 text-freight-800 rounded-full inline-block">
                        {order.volumes} vol • {order.weight} kg
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CollectionOrders;
