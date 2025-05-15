
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getCollectionOrdersByUserId } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Plus, 
  Eye, 
  Pencil, 
  Download, 
  Truck, 
  FileText 
} from "lucide-react";
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

  const handleView = (orderId: string) => {
    navigate(`/collection-order/view/${orderId}`);
  };

  const handleEdit = (orderId: string) => {
    navigate(`/collection-order/edit/${orderId}`);
  };

  const handleGenerateFreight = (orderId: string) => {
    navigate(`/collection-order/view/${orderId}`, { state: { generateFreight: true } });
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Ordens de Coleta</h1>
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
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Remetente</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead>Volumes</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{order.sender}</TableCell>
                    <TableCell>{order.originCity}/{order.originState} → {order.destinationCity}/{order.destinationState}</TableCell>
                    <TableCell>{order.volumes}</TableCell>
                    <TableCell>{order.weight} kg</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(order.id)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(order.id)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateFreight(order.id)}
                          title="Gerar Frete"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CollectionOrders;
