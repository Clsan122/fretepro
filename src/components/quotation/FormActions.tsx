
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";

interface FormActionsProps {
  onCancel?: () => void;
  onConvertToOrder: () => void;
  onExportPDF: () => void;
  onShare?: () => void;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onConvertToOrder,
  onExportPDF,
  onShare,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-10 sm:mb-0 justify-between">
      <div className="order-last sm:order-first">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onExportPDF}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>

        {onShare && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        )}
        
        <Button 
          type="button" 
          variant="secondary"
          onClick={onConvertToOrder}
        >
          Converter em Ordem
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? "Salvando..." : "Salvar Cotação"}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
