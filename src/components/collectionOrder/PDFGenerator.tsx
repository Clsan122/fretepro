
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PDFGeneratorProps {
  elementId: string;
  fileName: string;
}

export const usePDFGenerator = () => {
  const { toast } = useToast();
  
  const generatePDF = async ({ elementId, fileName }: PDFGeneratorProps) => {
    const printElement = document.getElementById(elementId);
    
    if (!printElement) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto geramos o PDF..."
    });
    
    try {
      const canvas = await html2canvas(printElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        windowWidth: 800,
        windowHeight: 1200
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(fileName);
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi gerado com sucesso!"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o PDF",
        variant: "destructive"
      });
    }
  };
  
  return { generatePDF };
};
