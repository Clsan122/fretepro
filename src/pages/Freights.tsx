
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getFreightsByUserId, getClientById, saveFreight, getDriverById, deleteFreight } from "@/utils/storage";
import { Freight } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Plus, FileText, Edit, Trash, Truck, Receipt, Download } from "lucide-react";
import FreightForm from "@/components/FreightForm";
import { formatCurrency } from "@/utils/formatters";
import SimpleFreightForm from "@/components/freight/SimpleFreightForm";

const Freights: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateSimpleDialogOpen, setIsCreateSimpleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);

  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      setFreights(userFreights);
    }
  }, [user]);

  const handleCreateFreight = (newFreight: Freight) => {
    saveFreight(newFreight);
    setFreights(prevFreights => [newFreight, ...prevFreights]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Frete cadastrado",
      description: "O frete foi cadastrado com sucesso!"
    });
  };

  const handleEditFreight = (updatedFreight: Freight) => {
    saveFreight(updatedFreight);
    setFreights(prevFreights => prevFreights.map(freight => 
      freight.id === updatedFreight.id ? updatedFreight : freight
    ));
    setIsEditDialogOpen(false);
    setSelectedFreight(null);
    toast({
      title: "Frete atualizado",
      description: "O frete foi atualizado com sucesso!"
    });
  };

  const handleDeleteFreight = () => {
    if (selectedFreight) {
      deleteFreight(selectedFreight.id);
      setFreights(prevFreights => prevFreights.filter(freight => freight.id !== selectedFreight.id));
      setIsDeleteDialogOpen(false);
      setSelectedFreight(null);
      toast({
        title: "Frete excluído",
        description: "O frete foi excluído com sucesso!"
      });
    }
  };

  const handleGenerateReceipt = (freight: Freight) => {
    navigate(`/freight/${freight.id}/receipt`);
  };

  const handleGenerateForm = (freight: Freight) => {
    navigate(`/freight-form/pdf?id=${freight.id}`);
  };

  const handleMultipleReceipt = () => {
    navigate("/freight/selection");
  };

  const filteredFreights = React.useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return freights.filter((f) => {
      const dateStr = f.departureDate || f.createdAt;
      const d = parseISO(dateStr);
      return isWithinInterval(d, { start, end });
    });
  }, [freights]);
  return (
    <Layout>
      <div className="container mx-auto py-6 pb-20">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Fretes</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              onClick={handleMultipleReceipt}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Receipt className="h-4 w-4" />
              Recibo Múltiplo
            </Button>
            <Button
              onClick={() => navigate('/simple-freight/selection')}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Receipt className="h-4 w-4" />
              Recibo Simples
            </Button>
            <Button 
              onClick={() => setIsCreateSimpleDialogOpen(true)}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Frete Simples
            </Button>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Novo Frete
            </Button>
          </div>
        </div>

        {filteredFreights.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum frete no mês atual</CardTitle>
              <CardDescription>Cadastre um frete simples ou completo clicando nos botões acima.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <Truck className="h-16 w-16 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cards para Mobile */}
            <div className="lg:hidden space-y-4">
              {filteredFreights.map((freight) => {
                const client = getClientById(freight.clientId);
                const driver = freight.driverId ? getDriverById(freight.driverId) : null;
                const netProfit = freight.netProfit !== undefined 
                  ? freight.netProfit 
                  : (freight.totalValue - (freight.totalExpenses || 0));
                  
                return (
                  <Card key={freight.id} className="cursor-pointer" onClick={() => {
                    setSelectedFreight(freight);
                    setIsDetailsDialogOpen(true);
                  }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-freight-700">{client?.name || "Cliente não encontrado"}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(freight.departureDate || freight.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(freight.totalValue)}</p>
                          <p className={`text-sm ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Lucro: {formatCurrency(netProfit)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Truck className="h-4 w-4" />
                        <span>{freight.originCity}/{freight.originState}</span>
                        <span>→</span>
                        <span>{freight.destinationCity}/{freight.destinationState}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Motorista: {driver?.name || freight.driverName || "Não atribuído"}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleGenerateReceipt(freight)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Gerar Recibo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGenerateForm(freight)}>
                              <Download className="mr-2 h-4 w-4" />
                              Formulário PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedFreight(freight);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedFreight(freight);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Tabela para Desktop */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Motorista</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Lucro</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFreights.map((freight) => {
                      const client = getClientById(freight.clientId);
                      const driver = freight.driverId ? getDriverById(freight.driverId) : null;
                      const netProfit = freight.netProfit !== undefined 
                        ? freight.netProfit 
                        : (freight.totalValue - (freight.totalExpenses || 0));
                        
                      return (
                        <TableRow key={freight.id}>
                          <TableCell className="font-medium">
                            {format(parseISO(freight.departureDate || freight.createdAt), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>{client?.name || "Cliente não encontrado"}</TableCell>
                          <TableCell>{freight.originCity}/{freight.originState}</TableCell>
                          <TableCell>{freight.destinationCity}/{freight.destinationState}</TableCell>
                          <TableCell>{driver?.name || freight.driverName || "Não atribuído"}</TableCell>
                          <TableCell className="text-right">{formatCurrency(freight.totalValue)}</TableCell>
                          <TableCell className={`text-right ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(netProfit)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleGenerateReceipt(freight)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Gerar Recibo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateForm(freight)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Formulário PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedFreight(freight);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedFreight(freight);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Frete</DialogTitle>
            </DialogHeader>
            <FreightForm 
              onSave={handleCreateFreight} 
              onCancel={() => setIsCreateDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateSimpleDialogOpen} onOpenChange={setIsCreateSimpleDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Frete Simples</DialogTitle>
            </DialogHeader>
            <SimpleFreightForm 
              onSave={handleCreateFreight} 
              onCancel={() => setIsCreateSimpleDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Frete</DialogTitle>
            </DialogHeader>
            {selectedFreight && (
              <FreightForm 
                onSave={handleEditFreight} 
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedFreight(null);
                }} 
                freightToEdit={selectedFreight}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir este frete? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedFreight(null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteFreight}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Frete</DialogTitle>
            </DialogHeader>
            {selectedFreight && (
              <div className="space-y-6">
                {(() => {
                  const client = getClientById(selectedFreight.clientId);
                  const driver = selectedFreight.driverId ? getDriverById(selectedFreight.driverId) : null;
                  const netProfit = selectedFreight.netProfit !== undefined 
                    ? selectedFreight.netProfit 
                    : (selectedFreight.totalValue - (selectedFreight.totalExpenses || 0));

                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Informações Gerais</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Data:</strong> {format(parseISO(selectedFreight.departureDate || selectedFreight.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                            <p><strong>Cliente:</strong> {client?.name || "Cliente não encontrado"}</p>
                            <p><strong>Motorista:</strong> {driver?.name || selectedFreight.driverName || "Não atribuído"}</p>
                            <p><strong>Status:</strong> {selectedFreight.status}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Valores</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Valor Total:</strong> {formatCurrency(selectedFreight.totalValue)}</p>
                            <p><strong>Despesas:</strong> {formatCurrency(selectedFreight.totalExpenses || 0)}</p>
                            <p className={`${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <strong>Lucro Líquido:</strong> {formatCurrency(netProfit)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Rota</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Origem:</strong></p>
                            <p>{selectedFreight.originCity}/{selectedFreight.originState}</p>
                          </div>
                          <div>
                            <p><strong>Destino:</strong></p>
                            <p>{selectedFreight.destinationCity}/{selectedFreight.destinationState}</p>
                          </div>
                        </div>
                        {selectedFreight.distance && (
                          <p className="mt-2 text-sm"><strong>Distância:</strong> {selectedFreight.distance} km</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Carga</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Tipo:</strong> {selectedFreight.cargoType}</p>
                            {selectedFreight.cargoDescription && (
                              <p><strong>Descrição:</strong> {selectedFreight.cargoDescription}</p>
                            )}
                          </div>
                          <div>
                            {selectedFreight.weight && (
                              <p><strong>Peso:</strong> {selectedFreight.weight} kg</p>
                            )}
                            {selectedFreight.volumes && (
                              <p><strong>Volumes:</strong> {selectedFreight.volumes}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={() => handleGenerateReceipt(selectedFreight)}
                          className="flex-1"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Gerar Recibo
                        </Button>
                        <Button 
                          onClick={() => handleGenerateForm(selectedFreight)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Formulário PDF
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Freights;
