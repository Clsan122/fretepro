import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getCollectionOrdersByUserId, deleteCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Truck, 
  Trash2,
  AlertTriangle,
  CheckSquare,
  XSquare,
  MoreVertical,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const CollectionOrders: React.FC = () => {
  const [orders, setOrders] = useState<CollectionOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const fetchOrders = async () => {
    if (user) {
      try {
        setLoading(true);
        const userOrders = await getCollectionOrdersByUserId(user.id);
        
        const sortedOrders = userOrders.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Erro ao buscar ordens de coleta:", error);
        toast.error("Erro ao carregar ordens de coleta");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleView = (orderId: string) => {
    if (isSelectionMode) {
      toggleOrderSelection(orderId);
    } else {
      navigate(`/collection-order/view/${orderId}`);
    }
  };

  const handleEdit = (orderId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (isSelectionMode) {
      toggleOrderSelection(orderId);
    } else {
      navigate(`/collection-order/edit/${orderId}`);
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      setDeletingOrderId(orderId);
      console.log("Excluindo ordem de coleta com ID:", orderId);
      
      await deleteCollectionOrder(orderId);
      
      setOrders(prevOrders => {
        const filteredOrders = prevOrders.filter(order => order.id !== orderId);
        console.log("Ordens restantes após exclusão:", filteredOrders.length);
        return filteredOrders;
      });
      
      await fetchOrders();
      
      toast.success("Ordem de coleta excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir ordem de coleta:", error);
      toast.error("Erro ao excluir ordem de coleta");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleGenerateFreight = (orderId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (isSelectionMode) {
      toggleOrderSelection(orderId);
    } else {
      navigate(`/collection-order/view/${orderId}`, { state: { generateFreight: true } });
    }
  };
  
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };
  
  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) {
      setSelectedOrders([]);
    }
  };
  
  const selectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };
  
  const deleteSelectedOrders = async () => {
    try {
      setIsDeletingMultiple(true);
      
      console.log("Excluindo ordens selecionadas:", selectedOrders);
      
      for (const orderId of selectedOrders) {
        try {
          await deleteCollectionOrder(orderId);
          console.log(`Ordem ${orderId} excluída com sucesso`);
        } catch (error) {
          console.error(`Falha ao excluir ordem ${orderId}:`, error);
        }
      }
      
      setOrders(prevOrders => {
        const filteredOrders = prevOrders.filter(order => !selectedOrders.includes(order.id));
        console.log("Ordens restantes após exclusão múltipla:", filteredOrders.length);
        return filteredOrders;
      });
      
      await fetchOrders();
      
      toast.success(`${selectedOrders.length} ordem(ns) excluída(s) com sucesso`);
      setSelectedOrders([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Erro ao excluir ordens selecionadas:", error);
      toast.error("Erro ao excluir ordens selecionadas");
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  // Mobile Card Component
  const MobileOrderCard = ({ order }: { order: CollectionOrder }) => (
    <div 
      className={`bg-white rounded-lg border shadow-sm p-4 mb-3 ${
        isSelectionMode && selectedOrders.includes(order.id) ? "border-freight-500 bg-freight-50" : ""
      }`}
      onClick={() => isSelectionMode ? toggleOrderSelection(order.id) : handleView(order.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isSelectionMode && (
              <Checkbox
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => toggleOrderSelection(order.id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <p className="font-medium text-gray-900 truncate">{order.sender}</p>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        {!isSelectionMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
              <DropdownMenuItem onClick={() => handleView(order.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(order.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleGenerateFreight(order.id)}>
                <Truck className="h-4 w-4 mr-2" />
                Gerar Frete
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Excluir Ordem de Coleta
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta ordem de coleta? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(order.id)} 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deletingOrderId === order.id}
                    >
                      {deletingOrderId === order.id ? 'Excluindo...' : 'Excluir'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Rota:</span> {order.originCity}/{order.originState} → {order.destinationCity}/{order.destinationState}</p>
        <div className="flex gap-4">
          <p><span className="font-medium">Volumes:</span> {order.volumes}</p>
          <p><span className="font-medium">Peso:</span> {order.weight} kg</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-3 md:p-6 h-full">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">Ordens de Coleta</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={toggleSelectionMode}
              variant={isSelectionMode ? "destructive" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              {isSelectionMode ? (
                <>
                  <XSquare className="mr-2 h-4 w-4" /> Cancelar
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" /> Selecionar
                </>
              )}
            </Button>
            <Button 
              onClick={() => navigate("/collection-order/new")}
              className="bg-freight-600 hover:bg-freight-700 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Ordem
            </Button>
          </div>
        </div>

        {isSelectionMode && selectedOrders.length > 0 && (
          <div className="bg-muted/30 border rounded-lg p-3 mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{selectedOrders.length} {selectedOrders.length === 1 ? 'ordem selecionada' : 'ordens selecionadas'}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={selectAllOrders}
                className="text-xs"
              >
                {selectedOrders.length === orders.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="destructive"
                  disabled={isDeletingMultiple}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> 
                  {isDeletingMultiple ? 'Excluindo...' : 'Excluir Selecionadas'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Excluir {selectedOrders.length} {selectedOrders.length === 1 ? 'Ordem' : 'Ordens'} de Coleta
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {selectedOrders.length > 1 ? 'essas ordens' : 'esta ordem'} de coleta? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={deleteSelectedOrders} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeletingMultiple ? 'Excluindo...' : 'Excluir'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

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
          <>
            {/* Mobile View */}
            <div className="md:hidden">
              {orders.map((order) => (
                <MobileOrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isSelectionMode && (
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onCheckedChange={selectAllOrders}
                          aria-label="Selecionar todas as ordens"
                        />
                      </TableHead>
                    )}
                    <TableHead>Data</TableHead>
                    <TableHead>Remetente</TableHead>
                    <TableHead className="hidden md:table-cell">Rota</TableHead>
                    <TableHead className="hidden sm:table-cell">Volumes</TableHead>
                    <TableHead className="hidden sm:table-cell">Peso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow 
                      key={order.id}
                      className={isSelectionMode && selectedOrders.includes(order.id) ? "bg-muted/40" : ""}
                      onClick={() => isSelectionMode ? toggleOrderSelection(order.id) : handleView(order.id)}
                    >
                      {isSelectionMode && (
                        <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => toggleOrderSelection(order.id)}
                            aria-label={`Selecionar ordem de ${order.sender}`}
                          />
                        </TableCell>
                      )}
                      <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate">
                          {order.sender}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{order.originCity}/{order.originState} → {order.destinationCity}/{order.destinationState}</TableCell>
                      <TableCell className="hidden sm:table-cell">{order.volumes}</TableCell>
                      <TableCell className="hidden sm:table-cell">{order.weight} kg</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          {!isSelectionMode ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleView(order.id); }}
                                title="Visualizar"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => handleEdit(order.id, e)}
                                title="Editar"
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => handleGenerateFreight(order.id, e)}
                                title="Gerar Frete"
                                className="h-8 w-8 p-0"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                                    title="Excluir"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5 text-destructive" />
                                      Excluir Ordem de Coleta
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir esta ordem de coleta? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(order.id)} 
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      disabled={deletingOrderId === order.id}
                                    >
                                      {deletingOrderId === order.id ? 'Excluindo...' : 'Excluir'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground pr-2">
                              Clique para selecionar
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CollectionOrders;
