
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Share2, Edit, ArrowLeft, Send } from "lucide-react";

interface QuotationViewActionsProps {
  id: string;
  sending: boolean;
  generating: boolean;
  sharing: boolean;
  handleSharePdf: () => void;
  handleSendQuotation: () => void;
  handleEdit: () => void;
}

const QuotationViewActions: React.FC<QuotationViewActionsProps> = ({
  id,
  sending,
  generating,
  sharing,
  handleSharePdf,
  handleSendQuotation,
  handleEdit
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-16 md:bottom-auto md:static z-10 w-full max-w-7xl bg-background/80 backdrop-blur-sm py-2 px-4 border-t md:border-none md:p-0 md:mb-6">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate("/quotations")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSharePdf}
            disabled={sharing}
            className="flex items-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {sharing ? "Compartilhando..." : "Compartilhar"}
          </Button>
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            onClick={handleSendQuotation}
            className="flex items-center bg-gradient-to-r from-freight-600 to-freight-800 hover:from-freight-700 hover:to-freight-900"
            disabled={sending || generating}
          >
            <Send className="mr-2 h-4 w-4" />
            {sending ? "Enviando..." : generating ? "Gerando PDF..." : "Enviar Cotação"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationViewActions;
