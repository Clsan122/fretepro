
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuotationPdfDocument } from "@/components/quotation/QuotationPdfDocument";
import { QuotationData } from "@/components/quotation/types";
import { generateQuotationPdf } from "@/utils/pdfGenerator";
import { Share2, Download, Printer, Send, Edit, ArrowLeft } from "lucide-react";

const QuotationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  useEffect(() => {
    if (id) {
      try {
        // Load quotations from localStorage
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        // Find the quotation with the given id
        const foundQuotation = storedQuotations.find(
          (q: any) => q.id === id
        );
        
        if (foundQuotation) {
          setQuotation(foundQuotation);
        } else {
          toast({
            title: "Erro",
            description: "Cotação não encontrada",
            variant: "destructive"
          });
          navigate("/quotations");
        }
      } catch (error) {
        console.error("Error loading quotation:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a cotação",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  }, [id, navigate, toast]);

  const handleGeneratePdf = async () => {
    if (id) {
      setGeneratingPdf(true);
      
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto preparamos o documento..."
      });
      
      try {
        const success = await generateQuotationPdf(id);
        
        if (success) {
          toast({
            title: "PDF gerado",
            description: "O PDF da cotação foi gerado com sucesso"
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível gerar o PDF",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao gerar o PDF",
          variant: "destructive"
        });
      } finally {
        setGeneratingPdf(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendQuotation = () => {
    setSending(true);
    // Simulação de envio - em uma versão real aqui seria feita a integração com email
    setTimeout(() => {
      toast({
        title: "Cotação enviada",
        description: "A cotação foi enviada com sucesso para o cliente."
      });
      setSending(false);
    }, 1500);
  };

  const handleEdit = () => {
    navigate(`/quotation/edit/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando cotação...</p>
        </div>
      </Layout>
    );
  }

  if (!quotation) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-muted-foreground mb-4">Cotação não encontrada</p>
          <Button onClick={() => navigate("/quotations")}>Voltar para cotações</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto pb-20 md:pb-10">
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
                onClick={handlePrint}
                className="flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={handleGeneratePdf}
                disabled={generatingPdf}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                {generatingPdf ? "Gerando..." : "Baixar PDF"}
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
                disabled={sending}
              >
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Enviando..." : "Enviar Cotação"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Conteúdo do PDF */}
        <div className="print-container">
          <Card className="p-6 shadow-md print-no-shadow">
            <QuotationPdfDocument quotation={quotation} />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default QuotationView;
