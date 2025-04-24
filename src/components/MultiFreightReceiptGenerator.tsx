
import React, { useRef, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { getCurrentUser } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { PrinterIcon, Download, Share2, Check } from "lucide-react";
import { 
  groupFreightsByClient, 
  getTotalAmount, 
  getDateRangeText 
} from "@/utils/receipt-helpers";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import ReceiptHeader from "./multi-freight-receipt/ReceiptHeader";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";
import { useIsMobile } from "@/hooks/use-mobile";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const dateRangeText = getDateRangeText(freights);
  const totalAmount = getTotalAmount(freights);
  const freightsByClient = groupFreightsByClient(freights);

  const generatePDF = async (): Promise<Blob> => {
    if (!componentRef.current) throw new Error("Elemento de recibo não encontrado");
    
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      componentRef.current.classList.add('print-mode');
      
      const canvas = await html2canvas(componentRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });
      
      componentRef.current.classList.remove('print-mode');
      
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );
      
      return pdf.output('blob');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo-multiplos-fretes-${new Date().toISOString().slice(0, 10)}.pdf`;
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
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const file = new File([pdfBlob], `recibo-multiplos-fretes-${new Date().toISOString().slice(0, 10)}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Recibo de Múltiplos Fretes`,
          text: `Recibo de fretes - ${new Date().toLocaleDateString()}`
        });
        
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        
        toast({
          title: "Sucesso",
          description: "Recibo compartilhado com sucesso!"
        });
      } else {
        handleDownload();
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Erro",
          description: "Não foi possível compartilhar o recibo",
          variant: "destructive"
        });
      }
    }
  };

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    pageStyle: "@page { size: A4; margin: 10mm; }",
  });

  const handlePrintWithContent = () => {
    if (componentRef.current) {
      handlePrint();
    }
  };

  const handlePrintButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handlePrintWithContent();
  };

  const handlePrintMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handlePrintWithContent();
  };

  return (
    <div className="p-2 md:p-4">
      <div className="mb-4 flex justify-end gap-2">
        {isMobile ? (
          <>
            <Button 
              variant="outline" 
              className="gap-2 w-full"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 w-full"
              onClick={handleShare}
            >
              {shareSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Compartilhado!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 w-full"
              onClick={handlePrintButtonClick}
            >
              <PrinterIcon className="h-4 w-4" />
              Imprimir
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Compartilhar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Baixar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrintMenuItemClick}>
                <PrinterIcon className="h-4 w-4 mr-2" /> Imprimir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div 
        ref={componentRef} 
        className={`bg-white p-4 mx-auto max-w-4xl shadow-sm print:shadow-none print:p-0 print-container ${isGenerating ? 'opacity-0 absolute' : ''}`}
      >
        <PrintStyles />
        <ReceiptHeader dateRangeText={dateRangeText} currentUser={currentUser} />
        <ClientDetailsSection freightsByClient={freightsByClient} />
        <ReceiptFooter totalAmount={totalAmount} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;
