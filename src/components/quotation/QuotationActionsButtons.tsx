
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { QuotationData } from "./types";
import { Save, FileText, FileDown } from "lucide-react";
import { Loader2 } from "lucide-react";

interface QuotationActionsButtonsProps {
  loading: boolean;
  handleSave: () => void;
  handleGeneratePdf: () => void;
  quotationData: Partial<QuotationData>;
  isPreviewMode?: boolean;
}

export const QuotationActionsButtons: React.FC<QuotationActionsButtonsProps> = ({
  loading,
  handleSave,
  handleGeneratePdf,
  quotationData,
  isPreviewMode = false
}) => {
  const navigate = useNavigate();

  const handleCreateCollectionOrder = () => {
    // Salvar dados da cotação no localStorage para serem usados na criação da ordem de coleta
    localStorage.setItem('quotationForCollectionOrder', JSON.stringify(quotationData));
    // Navegar para a página de criação de ordem de coleta
    navigate('/collection-orders/new');
  };

  return (
    <div className="flex flex-wrap gap-4 justify-end pt-4 pb-20 md:pb-4">
      <Button
        variant="outline"
        className="w-full md:w-auto"
        onClick={() => navigate("/quotations")}
      >
        Cancelar
      </Button>

      <Button
        variant="outline"
        className="w-full md:w-auto"
        onClick={handleGeneratePdf}
      >
        <FileText className="mr-2 h-5 w-5" />
        Visualizar PDF
      </Button>
      
      {!isPreviewMode && (
        <Button
          variant="outline"
          className="w-full md:w-auto bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
          onClick={handleCreateCollectionOrder}
        >
          <FileDown className="mr-2 h-5 w-5" />
          Fechar Cotação
        </Button>
      )}
      
      <Button
        className="w-full md:w-auto bg-gradient-to-r from-freight-600 to-freight-800 hover:from-freight-700 hover:to-freight-900 hover:shadow-lg transition-all"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Save className="mr-2 h-5 w-5" />
        )}
        Salvar Cotação
      </Button>
    </div>
  );
};
