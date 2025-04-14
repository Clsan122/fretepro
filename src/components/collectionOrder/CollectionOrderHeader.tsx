
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Printer, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CollectionOrderHeaderProps {
  id: string;
  handleDelete: () => void;
  handlePrint: () => void;
  handleSavePDF: () => void;
}

export const CollectionOrderHeader: React.FC<CollectionOrderHeaderProps> = ({
  id,
  handleDelete,
  handlePrint,
  handleSavePDF
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between mb-4 print:hidden">
      <div className="flex items-center mb-2 md:mb-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/collection-orders")}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Ordem de Coleta</h1>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSavePDF}
        >
          <Download className="h-4 w-4 mr-1" /> Salvar PDF
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-1" /> Imprimir
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/collection-order/edit/${id}`)}
        >
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir ordem de coleta</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta ordem de coleta? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
