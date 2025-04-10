
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Driver } from "@/types";
import { 
  getDriversByUserId, 
  addDriver, 
  updateDriver, 
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, User, Truck } from "lucide-react";
import DriverForm from "@/components/DriverForm";

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
    }
  }, [user]);

  const handleAddDriver = (driver: Driver) => {
    addDriver(driver);
    setDrivers(prevDrivers => [...prevDrivers, driver]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Motorista cadastrado",
      description: "O motorista foi cadastrado com sucesso!",
    });
  };

  const handleEditDriver = (driver: Driver) => {
    updateDriver(driver);
    setDrivers(prevDrivers => 
      prevDrivers.map(d => (d.id === driver.id ? driver : d))
    );
    setIsEditDialogOpen(false);
    setSelectedDriver(null);
    
    toast({
      title: "Motorista atualizado",
      description: "As informações do motorista foram atualizadas com sucesso!",
    });
  };

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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Motoristas</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-freight-600 hover:bg-freight-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Motorista
            </Button>
          </div>
        </div>

        {drivers.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Placa do Veículo</TableHead>
                  <TableHead>Tipo de Veículo</TableHead>
                  <TableHead>Tipo de Carroceria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.cpf}</TableCell>
                    <TableCell>{driver.licensePlate}</TableCell>
                    <TableCell>{driver.vehicleType}</TableCell>
                    <TableCell>{driver.bodyType}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsEditDialogOpen(true);
                          }}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              Você ainda não cadastrou nenhum motorista.
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar seu primeiro motorista
            </Button>
          </div>
        )}
      </div>

      {/* Add Driver Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Motorista</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo motorista.
            </DialogDescription>
          </DialogHeader>
          <DriverForm
            onSave={handleAddDriver}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Motorista</DialogTitle>
            <DialogDescription>
              Atualize os dados do motorista.
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <DriverForm
              driverToEdit={selectedDriver}
              onSave={handleEditDriver}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedDriver(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
