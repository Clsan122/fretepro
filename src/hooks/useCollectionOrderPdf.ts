
import { useState } from "react";
import { CollectionOrder } from "@/types";
import { generateCollectionOrderPdf } from "@/utils/pdf/collectionOrderPdf";
import { useToast } from "@/hooks/use-toast";

export const useCollectionOrderPdf = (order: CollectionOrder | null, id?: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (options: { 
    savePdf?: boolean; 
    openInNewTab?: boolean;
    filename?: string;
  } = {}): Promise<Blob> => {
    if (!order) {
      throw new Error("Ordem não disponível para geração de PDF");
    }
    
    setIsGenerating(true);
    
    try {
      const pdfBlob = await generateCollectionOrderPdf(
        'collection-order-print', 
        order,
        options
      );
      return pdfBlob;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!order) return;
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const file = new File([pdfBlob], `ordem-coleta-${order.orderNumber}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Ordem de Coleta - ${order.originCity} para ${order.destinationCity}`,
          text: `Ordem de coleta para transporte de ${order.originCity}/${order.originState} para ${order.destinationCity}/${order.destinationState}`,
        });
        
        toast({
          title: "Sucesso",
          description: "Documento compartilhado com sucesso!"
        });
      } else {
        // Caso não tenha suporte a compartilhamento, fazer download diretamente
        await handleDownload();
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF para compartilhamento",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = async () => {
    if (!order) return;
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento para download..."
    });
    
    try {
      await generatePDF({
        savePdf: true,
        filename: `ordem-coleta-${order.orderNumber}.pdf`
      });
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi baixado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
    }
  };
  
  const handlePreview = async () => {
    if (!order) return;
    
    toast({
      title: "Gerando Pré-visualização",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      await generatePDF({ openInNewTab: true });
      
      toast({
        title: "Pré-visualização gerada",
        description: "O documento foi aberto em uma nova aba"
      });
    } catch (error) {
      console.error("Erro ao gerar pré-visualização do PDF:", error);
      toast({
        title: "Erro", 
        description: "Não foi possível gerar a pré-visualização",
        variant: "destructive"
      });
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  return {
    isGenerating,
    handleShare,
    handleDownload,
    handlePreview,
    handlePrint
  };
};
