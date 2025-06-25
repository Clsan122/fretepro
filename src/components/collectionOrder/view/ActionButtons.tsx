
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Share2, Download, Printer, Truck, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Trash2, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionButtonsProps {
  id?: string;
  onDelete: () => Promise<void>;
  onShare: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onGenerateFreight: () => void;
  onViewHtml: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  onDelete,
  onShare,
  onDownload,
  onPrint,
  onGenerateFreight,
  onViewHtml
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Header com botão voltar e título */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/collection-orders")}
          className="shrink-0"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> 
          {isMobile ? "" : "Voltar"}
        </Button>
        <h1 className="text-lg md:text-2xl font-bold truncate">Ordem de Coleta</h1>
      </div>

      {/* Botões de ação organizados para mobile */}
      <div className="flex flex-wrap gap-2">
        {/* Primeira linha - ações principais */}
        <div className="flex gap-2 flex-wrap w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/collection-order/edit/${id}`)}
            className="flex-1 sm:flex-none min-w-0"
          >
            <Edit className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Editar</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateFreight}
            className="flex-1 sm:flex-none min-w-0"
          >
            <Truck className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Gerar Frete</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="flex-1 sm:flex-none min-w-0"
          >
            <Printer className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
        </div>

        {/* Segunda linha - ações secundárias */}
        <div className="flex gap-2 flex-wrap w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="flex-1 sm:flex-none min-w-0"
          >
            <Download className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex-1 sm:flex-none min-w-0"
          >
            <Share2 className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>

          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewHtml}
              className="flex-none"
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar HTML
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 sm:flex-none min-w-0"
              >
                <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Excluir</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Excluir Ordem de Coleta
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta ordem de coleta? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDelete}
                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
