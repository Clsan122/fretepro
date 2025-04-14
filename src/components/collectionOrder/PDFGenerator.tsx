
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PDFGeneratorProps {
  elementId: string;
  fileName: string;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

export const usePDFGenerator = () => {
  const { toast } = useToast();
  
  const generatePDF = async ({ 
    elementId, 
    fileName, 
    format = "a4",
    orientation = "portrait" 
  }: PDFGeneratorProps) => {
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
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: printElement.offsetWidth,
        windowHeight: printElement.offsetHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate the dimensions to fit the content on one page
      let imgWidth = pageWidth - 20; // Changed from const to let since we might modify it later
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If the height exceeds the page height, scale to fit
      if (imgHeight > pageHeight - 20) {
        imgHeight = pageHeight - 20;
        // Adjust width proportionally
        const widthToHeight = canvas.width / canvas.height;
        imgWidth = imgHeight * widthToHeight;
      }
      
      // Center the image on the page
      const xPos = (pageWidth - imgWidth) / 2;
      const yPos = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
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
