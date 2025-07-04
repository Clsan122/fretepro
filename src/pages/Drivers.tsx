
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Driver } from "@/types";
import { 
  getDriversByUserId, 
  deleteDriver 
} from "@/utils/storage";
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
import { Link, useNavigate } from "react-router-dom";

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      setFilteredDrivers(userDrivers);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        driver.cpf.includes(searchTerm) ||
        driver.licensePlate.includes(searchTerm)
      );
      setFilteredDrivers(filtered);
    }
  }, [searchTerm, drivers]);

  const handleDeleteDriver = () => {
    if (selectedDriver) {
      deleteDriver(selectedDriver.id);
      setDrivers(prevDrivers => 
        prevDrivers.filter(d => d.id !== selectedDriver.id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedDriver(null);
      
      toast({
        title: "Motorista removido",
        description: "O motorista foi removido com sucesso!",
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

        {/* Mobile/Desktop responsive layout for drivers */}
        {filteredDrivers.length > 0 ? (
          <>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{driver.name}</h3>
                      <p className="text-sm text-gray-500">CPF: {driver.cpf}</p>
                      <p className="text-sm text-gray-500">Placa: {driver.licensePlate}</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/drivers/edit/${driver.id}`)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>{driver.vehicleType} - {driver.bodyType}</p>
                    {driver.trailerPlate && (
                      <p>Reboque: {driver.trailerPlate}</p>
                    )}
                    <p>ANTT: {driver.anttCode}</p>
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
                    <TableHead>Placa do Veículo</TableHead>
                    <TableHead className="hidden lg:table-cell">Tipo de Veículo</TableHead>
                    <TableHead className="hidden lg:table-cell">Tipo de Carroceria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.cpf}</TableCell>
                      <TableCell>{driver.licensePlate}</TableCell>
                      <TableCell className="hidden lg:table-cell">{driver.vehicleType}</TableCell>
                      <TableCell className="hidden lg:table-cell">{driver.bodyType}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/drivers/edit/${driver.id}`)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedDriver(driver);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
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
          <div className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              {searchTerm ? "Nenhum motorista encontrado com esses termos." : "Você ainda não cadastrou nenhum motorista."}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/drivers/new')} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar seu primeiro motorista
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Motorista</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este motorista? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDriver}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Drivers;
