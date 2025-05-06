
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Printer, Share2 } from "lucide-react";
import Layout from "@/components/Layout";
import { getClientById } from "@/utils/storage";
import { QuotationFormData } from "@/hooks/useQuotationForm";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
import QuotationPdfContent from "@/components/quotation/QuotationPdfContent";
import { PrintStyles } from "@/components/quotation/PrintStyles";
import { useQuotationPdf } from "@/hooks/useQuotationPdf";

const QuotationView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotation, setQuotation] = useState<QuotationFormData | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Usar nosso hook de geração de PDF
  const { isGenerating, handleShare, handleDownload, handlePrint } = useQuotationPdf(quotation);

  useEffect(() => {
    // Recuperar dados da cotação do estado da navegação
    const stateData = location.state?.quotation;
    if (stateData) {
      setQuotation(stateData);
      
      // Buscar cliente se tivermos o ID
      if (stateData.clientId) {
        const clientData = getClientById(stateData.clientId);
        if (clientData) {
          setClient(clientData);
        }
      }
    } else {
      // Redirecionar se não houver dados
      toast({
        title: "Erro",
        description: "Dados da cotação não encontrados",
        variant: "destructive"
      });
      navigate("/quotations");
    }
  }, [location.state, navigate, toast]);

  if (!quotation) {
    return (
      <Layout>
        <div className="p-4 md:p-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/quotations")}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 print-container">
        {/* Botões de ação */}
        <div className="flex flex-wrap justify-between items-center mb-6 print-exclude">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              disabled={isGenerating}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              disabled={isGenerating}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
        
        <PrintStyles />
        
        <div 
          id="quotation-pdf-content" 
          ref={printRef}
          className={`bg-white rounded-lg p-6 shadow-md print:shadow-none print:p-0 print:m-0 ${isGenerating ? 'opacity-0 absolute' : ''}`}
        >
          <QuotationPdfContent 
            quotation={quotation}
            client={client}
          />
        </div>
      </div>
    </Layout>
  );
};

export default QuotationView;
