
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Share2, Trash2, Printer, Download, Truck, FileText, FileJson } from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  id?: string;
  onDelete: () => Promise<void>;
  onShare: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onGenerateFreight?: () => void;
  onViewHtml?: () => void; // Nova opção para visualização HTML
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  onDelete,
  onShare,
  onDownload,
  onPrint,
  onGenerateFreight,
  onViewHtml,
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      // Navegação vai ser feita pelo componente pai após confirmação da exclusão
    } catch (error) {
      console.error("Erro ao excluir ordem de coleta:", error);
      setIsDeleting(false);
    }
  };

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
      
      <div className="flex flex-wrap gap-2">
        {/* Botão de visualização HTML */}
        {onViewHtml && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewHtml}
            className="gap-1"
          >
            <FileJson className="h-4 w-4" /> Ver HTML
          </Button>
        )}
        
        {/* Botão para gerar frete */}
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateFreight}
          className="gap-1"
        >
          <Truck className="h-4 w-4" /> Gerar Frete
        </Button>
        
        {/* Dropdown para opções de compartilhamento */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-1" /> Compartilhar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onShare}>
              <FileJson className="h-4 w-4 mr-2" /> Compartilhar como HTML
            </DropdownMenuItem>
            {onDownload && (
              <DropdownMenuItem onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" /> Baixar PDF
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onPrint && (
              <DropdownMenuItem onClick={onPrint}>
                <Printer className="h-4 w-4 mr-2" /> Imprimir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Botão de edição */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/collection-order/edit/${id}`)}
        >
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        
        {/* Diálogo para exclusão */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" /> {isDeleting ? 'Excluindo...' : 'Excluir'}
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
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
