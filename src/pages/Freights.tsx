import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Freight } from "@/types";
import { getFreightsByUserId, deleteFreight } from "@/utils/storage";
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
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Freights: React.FC = () => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      setFreights(userFreights);
      setFilteredFreights(userFreights);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFreights(freights);
    } else {
      const filtered = freights.filter(freight => 
        freight.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.cargoType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFreights(filtered);
    }
  }, [searchTerm, freights]);

  const handleDeleteFreight = () => {
    if (selectedFreight) {
      deleteFreight(selectedFreight.id);
      setFreights(prevFreights => 
        prevFreights.filter(f => f.id !== selectedFreight.id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedFreight(null);
      
      toast({
        title: "Frete removido",
        description: "O frete foi removido com sucesso!",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Fretes</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <div className="relative">
              <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar fretes..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate('/freights/new')} 
              className="bg-freight-600 hover:bg-freight-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Frete
            </Button>
          </div>
        </div>

        {filteredFreights.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo de Carga</TableHead>
                  <TableHead className="hidden md:table-cell">Valor Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFreights.map((freight) => (
                  <TableRow key={freight.id}>
                    <TableCell className="font-medium">{freight.originCity} - {freight.originState}</TableCell>
                    <TableCell>{freight.destinationCity} - {freight.destinationState}</TableCell>
                    <TableCell className="hidden md:table-cell">{freight.cargoType}</TableCell>
                    <TableCell className="hidden md:table-cell">R$ {freight.totalValue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/freights/edit/${freight.id}`)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedFreight(freight);
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
            <Package className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              {searchTerm ? "Nenhum frete encontrado com esses termos." : "Você ainda não cadastrou nenhum frete."}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/freights/new')} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar seu primeiro frete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Frete</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este frete? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFreight}
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

export default Freights;
