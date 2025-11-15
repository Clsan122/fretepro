import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Pencil, Trash2, Truck, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  address?: string;
  license_plate: string;
  trailer_plate?: string;
  vehicle_type: string;
  body_type: string;
  antt_code: string;
  vehicle_year: string;
  vehicle_model: string;
  user_id: string;
  company_id?: string;
  created_at: string;
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { companyId } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDrivers();
  }, [user, companyId]);

  const fetchDrivers = async () => {
    if (!user || !companyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDrivers(data || []);
      setFilteredDrivers(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar motoristas:', error);
      toast({
        title: "Erro ao carregar motoristas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        driver.cpf.includes(searchTerm) ||
        driver.license_plate.includes(searchTerm)
      );
      setFilteredDrivers(filtered);
    }
  }, [searchTerm, drivers]);

  const handleDeleteDriver = async () => {
    if (!selectedDriver) return;

    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', selectedDriver.id);

      if (error) throw error;

      setDrivers(prevDrivers => 
        prevDrivers.filter(d => d.id !== selectedDriver.id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedDriver(null);
      
      toast({
        title: "Motorista removido",
        description: "O motorista foi removido com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao remover motorista:', error);
      toast({
        title: "Erro ao remover motorista",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="p-3 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Motoristas</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar motorista..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate('/drivers/new')} 
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Novo Motorista
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando motoristas...
          </div>
        ) : filteredDrivers.length > 0 ? (
          <>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="bg-card rounded-lg border shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">CPF: {driver.cpf}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/drivers/edit/${driver.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{driver.license_plate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div>
                        <p className="text-muted-foreground text-xs">Tipo</p>
                        <p className="font-medium">{driver.vehicle_type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Carroceria</p>
                        <p className="font-medium">{driver.body_type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead className="hidden lg:table-cell">Tipo</TableHead>
                    <TableHead className="hidden lg:table-cell">Carroceria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.cpf}</TableCell>
                      <TableCell>{driver.phone}</TableCell>
                      <TableCell>{driver.license_plate}</TableCell>
                      <TableCell className="hidden lg:table-cell">{driver.vehicle_type}</TableCell>
                      <TableCell className="hidden lg:table-cell">{driver.body_type}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/drivers/edit/${driver.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDriver(driver);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum motorista cadastrado</p>
            <p className="text-sm">Comece adicionando um novo motorista</p>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o motorista {selectedDriver?.name}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDriver}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Drivers;
