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
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Plus, FileText, Edit, Trash, Truck } from "lucide-react";
import FreightForm from "@/components/FreightForm";

const Freights: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);

  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      setFreights(userFreights);
    }
  }, [user]);

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
    navigate(`/freight-receipt?ids=${freight.id}`);
  };

  const handleCreateNew = () => {
    navigate("/freights/new");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Fretes</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              onClick={() => navigate("/freight-selection")}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <FileText className="h-4 w-4" />
              Recibo Múltiplo
            </Button>
            <Button 
              onClick={handleCreateNew}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Novo Frete
            </Button>
          </div>
        </div>

        {freights.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum frete cadastrado</CardTitle>
              <CardDescription>Cadastre seu primeiro frete clicando no botão acima.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <Truck className="h-16 w-16 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
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
                  {freights.map((freight) => {
                    const client = getClientById(freight.clientId);
                    const driver = freight.driverId ? getDriverById(freight.driverId) : null;
                    const netProfit = freight.netProfit !== undefined 
                      ? freight.netProfit 
                      : (freight.totalValue - (freight.totalExpenses || 0));
                      
                    return (
                      <TableRow key={freight.id}>
                        <TableCell className="font-medium">
                          {format(parseISO(freight.createdAt), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{client?.name || "Cliente não encontrado"}</TableCell>
                        <TableCell>{freight.originCity}/{freight.originState}</TableCell>
                        <TableCell>{freight.destinationCity}/{freight.destinationState}</TableCell>
                        <TableCell>{driver?.name || "Não atribuído"}</TableCell>
                        <TableCell className="text-right">R$ {freight.totalValue.toFixed(2)}</TableCell>
                        <TableCell className={`text-right ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {netProfit.toFixed(2)}
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
        )}

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
      </div>
    </Layout>
  );
};

export default Freights;
