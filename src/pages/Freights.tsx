import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
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
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Plus, FileText, Edit, Trash, Truck, Receipt } from "lucide-react";

import { formatCurrency } from "@/utils/formatters";
import SimpleFreightForm from "@/components/freight/SimpleFreightForm";
import SimpleFreightEditForm from "@/components/freight/SimpleFreightEditForm";

interface Freight {
  id: string;
  user_id: string;
  company_id?: string;
  client_id: string;
  driver_id?: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  distance: number;
  price: number;
  total_value: number;
  freight_value: number;
  cargo_type: string;
  cargo_description?: string;
  status: string;
  payment_status: string;
  departure_date?: string;
  arrival_date?: string;
  weight?: number;
  volumes?: number;
  created_at: string;
}

const Freights: React.FC = () => {
  const { user } = useAuth();
  const { companyId } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [clients, setClients] = useState<Record<string, any>>({});
  const [drivers, setDrivers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isCreateSimpleDialogOpen, setIsCreateSimpleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);

  useEffect(() => {
    fetchFreights();
  }, [user, companyId]);

  const fetchFreights = async () => {
    if (!user || !companyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('freights')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFreights(data || []);

      if (data && data.length > 0) {
        const clientIds = [...new Set(data.map(f => f.client_id))];
        const driverIds = [...new Set(data.map(f => f.driver_id).filter(Boolean))];

        const [clientsData, driversData] = await Promise.all([
          supabase.from('clients').select('*').in('id', clientIds),
          driverIds.length > 0 ? supabase.from('drivers').select('*').in('id', driverIds) : Promise.resolve({ data: [] })
        ]);

        const clientsMap = (clientsData.data || []).reduce((acc, client) => {
          acc[client.id] = client;
          return acc;
        }, {} as Record<string, any>);

        const driversMap = (driversData.data || []).reduce((acc, driver) => {
          acc[driver.id] = driver;
          return acc;
        }, {} as Record<string, any>);

        setClients(clientsMap);
        setDrivers(driversMap);
      }
    } catch (error: any) {
      console.error('Erro ao buscar fretes:', error);
      toast({
        title: "Erro ao carregar fretes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFreight = async (newFreight: any) => {
    try {
      const { data, error } = await supabase
        .from('freights')
        .insert({
          ...newFreight,
          company_id: companyId,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setIsCreateSimpleDialogOpen(false);
      toast({
        title: "Frete cadastrado",
        description: "O frete foi cadastrado com sucesso!"
      });
      await fetchFreights();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar frete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditFreight = async (updatedFreight: any) => {
    try {
      const { error } = await supabase
        .from('freights')
        .update(updatedFreight)
        .eq('id', updatedFreight.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setSelectedFreight(null);
      toast({
        title: "Frete atualizado",
        description: "O frete foi atualizado com sucesso!"
      });
      await fetchFreights();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar frete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteFreight = async () => {
    if (!selectedFreight) return;

    try {
      const { error } = await supabase
        .from('freights')
        .delete()
        .eq('id', selectedFreight.id);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setSelectedFreight(null);
      toast({
        title: "Frete excluído",
        description: "O frete foi excluído com sucesso!"
      });
      await fetchFreights();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir frete",
        description: error.message,
        variant: "destructive",
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
      const dateStr = f.departure_date || f.created_at;
      const d = parseISO(dateStr);
      return isWithinInterval(d, { start, end });
    });
  }, [freights]);

  return (
    <Layout>
      <div className="container mx-auto p-3 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Fretes</h1>
            <p className="text-muted-foreground">Gerenciamento de fretes do mês atual</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={handleMultipleReceipt}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Receipt className="h-4 w-4" />
              Recibo Múltiplo
            </Button>
            <Button 
              onClick={() => setIsCreateSimpleDialogOpen(true)}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4" />
              Novo Frete
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando fretes...
          </div>
        ) : filteredFreights.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum frete no mês atual</CardTitle>
              <CardDescription>Cadastre um frete clicando no botão acima.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <Truck className="h-16 w-16 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFreights.map((freight) => {
              const client = clients[freight.client_id];
              const driver = freight.driver_id ? drivers[freight.driver_id] : null;
              const netProfit = freight.total_value - freight.freight_value;

              return (
                <Card key={freight.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{client?.name || "Cliente não encontrado"}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div>Data: {format(parseISO(freight.departure_date || freight.created_at), "dd/MM/yyyy", { locale: ptBR })}</div>
                      <div>Origem: {freight.origin_city}/{freight.origin_state}</div>
                      <div>Destino: {freight.destination_city}/{freight.destination_state}</div>
                      {driver && <div>Motorista: {driver.name}</div>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {formatCurrency(freight.total_value)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lucro: {formatCurrency(netProfit)}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
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
                            <FileText className="mr-2 h-4 w-4" />
                            Gerar Formulário
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedFreight(freight);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedFreight(freight);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
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
        )}
      </div>

      <Dialog open={isCreateSimpleDialogOpen} onOpenChange={setIsCreateSimpleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Frete</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-muted-foreground">Formulário de cadastro em desenvolvimento</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Frete</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-muted-foreground">Formulário de edição em desenvolvimento</p>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este frete? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFreight}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Freights;
