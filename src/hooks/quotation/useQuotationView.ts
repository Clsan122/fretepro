
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuotationData } from "@/components/quotation/types";
import { generateQuotationPdf, shareQuotationPdf } from "@/utils/pdf";

export const useQuotationView = (id: string | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  
  useEffect(() => {
    if (id) {
      try {
        // Load quotations from localStorage
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        console.log("All quotations:", storedQuotations);
        
        // Find the quotation with the given id - don't filter by user ID here
        const foundQuotation = storedQuotations.find(
          (q: any) => q.id === id
        );
        
        console.log("Looking for quotation with ID:", id);
        console.log("Found quotation:", foundQuotation);
        
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

  const handleSharePdf = async () => {
    if (!id || !quotation) return;
    
    setSharing(true);
    toast({
      title: "Preparando para compartilhar",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const pdfBlob = await shareQuotationPdf(id);
      
      // Tentar usar a Web Share API para compartilhar o arquivo
      const file = new File([pdfBlob], `cotacao-frete-${id}.pdf`, { type: 'application/pdf' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
          text: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
        });
        
        toast({
          title: "Compartilhado",
          description: "A cotação foi compartilhada com sucesso"
        });
      } else {
        // Fallback para download se Web Share API não estiver disponível
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cotacao-frete-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download concluído",
          description: "O PDF foi baixado pois o compartilhamento não é suportado"
        });
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o documento",
        variant: "destructive"
      });
    } finally {
      setSharing(false);
    }
  };

  const handleSendQuotation = async () => {
    if (!id || !quotation) return;
    
    setSending(true);
    setGenerating(true);
    
    try {
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto preparamos o documento..."
      });
      
      // Gerar o PDF da cotação
      const success = await generateQuotationPdf(id);
      
      if (success) {
        toast({
          title: "Cotação enviada",
          description: "A cotação foi enviada com sucesso para o cliente."
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o PDF da cotação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending quotation:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a cotação",
        variant: "destructive"
      });
    } finally {
      setSending(false);
      setGenerating(false);
    }
  };

  const handleEdit = () => {
    navigate(`/quotations/edit/${id}`);
  };
  
  return {
    quotation,
    loading,
    sending,
    generating,
    sharing,
    handleSharePdf,
    handleSendQuotation,
    handleEdit
  };
};
