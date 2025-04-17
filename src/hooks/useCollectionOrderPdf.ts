
import { useState } from "react";
import { CollectionOrder } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

export const useCollectionOrderPdf = (order: CollectionOrder | null, id?: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (): Promise<Blob> => {
    const printElement = document.getElementById('collection-order-print');
    
    if (!printElement) {
      throw new Error("Elemento de impressão não encontrado");
    }
    
    setIsGenerating(true);
    
    try {
      const originalWidth = printElement.style.width;
      printElement.style.width = '800px';
      
      // Esconder elementos que não devem aparecer na impressão
      const elementsToHide = printElement.querySelectorAll('.print-exclude');
      elementsToHide.forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      
      // Adicionar classe de modo de impressão
      printElement.classList.add('print-mode');
      
      const canvas = await html2canvas(printElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 800,
        windowHeight: 1200,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });
      
      // Restaurar elementos escondidos
      elementsToHide.forEach(element => {
        (element as HTMLElement).style.display = '';
      });
      
      // Remover classe de modo de impressão
      printElement.classList.remove('print-mode');
      printElement.style.width = originalWidth;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      return pdf.output('blob');
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
      const file = new File([pdfBlob], `ordem-coleta-${id}.pdf`, { type: 'application/pdf' });

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
        const downloadPDF = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadPDF;
        link.download = `ordem-coleta-${id}.pdf`;
        link.click();
        
        toast({
          title: "PDF gerado",
          description: "O PDF foi baixado automaticamente pois seu navegador não suporta compartilhamento direto."
        });
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
      const pdfBlob = await generatePDF();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ordem-coleta-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
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
  
  const handlePrint = () => {
    window.print();
  };

  return {
    isGenerating,
    handleShare,
    handleDownload,
    handlePrint
  };
};
