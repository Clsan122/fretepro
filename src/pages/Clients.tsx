import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@/types";
import { getClientsByUserId, saveClient, updateClient, deleteClient } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import ClientForm from "@/components/ClientForm";

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
      setFilteredClients(userClients);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleAddClient = (client: Client) => {
    saveClient(client);
    
    setClients(prevClients => [...prevClients, client]);
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: "O cliente foi cadastrado com sucesso!",
    });
  };

  const handleEditClient = (client: Client) => {
    updateClient(client);
    
    setClients(prevClients => 
      prevClients.map(c => (c.id === client.id ? client : c))
    );
    
    setIsEditDialogOpen(false);
    setSelectedClient(null);
    
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas com sucesso!",
    });
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      
      setClients(prevClients => 
        prevClients.filter(c => c.id !== selectedClient.id)
      );
      
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
      
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso!",
      });
    }
  };

  return (
    <Layout>
      <div className="p-3 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Clientes</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-freight-600 hover:bg-freight-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Mobile/Desktop responsive layout for clients */}
        {filteredClients.length > 0 ? (
          <>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3">
              {filteredClients.map((client) => (
                <div key={client.id} className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.city}/{client.state}</p>
                      {client.phone && (
                        <p className="text-xs text-gray-400 mt-1">{client.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {client.cnpj && (
                    <p className="text-xs text-gray-500">CNPJ: {client.cnpj}</p>
                  )}
                  {client.cpf && (
                    <p className="text-xs text-gray-500">CPF: {client.cpf}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.city}</TableCell>
                      <TableCell>{client.state}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsDeleteDialogOpen(true);
                            }}
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
            <p className="text-center text-muted-foreground">
              {searchTerm
                ? "Nenhum cliente encontrado com os critérios de busca."
                : "Você ainda não cadastrou nenhum cliente."}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar seu primeiro cliente
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo cliente.
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            onSave={handleAddClient}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize os dados do cliente.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              initialData={selectedClient}
              onSave={handleEditClient}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedClient(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.
              {selectedClient && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>{selectedClient.name}</strong> - {selectedClient.city}/{selectedClient.state}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClient}
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

export default Clients;
