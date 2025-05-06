
import { useState } from "react";
import { QuotationFormData } from "./useQuotationForm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

export const useQuotationPdf = (quotation: QuotationFormData | null) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (): Promise<Blob> => {
    const printElement = document.getElementById('quotation-pdf-content');
    
    if (!printElement) {
      throw new Error("Elemento de impressão não encontrado");
    }
    
    setIsGenerating(true);
    
    try {
      const originalWidth = printElement.style.width;
      printElement.style.width = '800px';
      
      const elementsToHide = printElement.querySelectorAll('.print-exclude');
      elementsToHide.forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });
      
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
      
      elementsToHide.forEach(element => {
        (element as HTMLElement).style.display = '';
      });
      
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

  const handleDownload = async () => {
    if (!quotation) return;
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento para download..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cotacao-${new Date().toISOString().slice(0, 10)}.pdf`;
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

  const handleShare = async () => {
    if (!quotation) return;
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const file = new File([pdfBlob], `cotacao-${new Date().toISOString().slice(0, 10)}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Cotação - ${quotation.originCity} para ${quotation.destinationCity}`,
          text: `Cotação para transporte de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
        });
        
        toast({
          title: "Sucesso",
          description: "Documento compartilhado com sucesso!"
        });
      } else {
        // Fallback para download se o compartilhamento não for suportado
        const downloadPDF = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadPDF;
        link.download = `cotacao-${new Date().toISOString().slice(0, 10)}.pdf`;
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
