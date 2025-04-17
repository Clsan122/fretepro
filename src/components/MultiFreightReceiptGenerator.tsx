
import React, { useRef, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { getUser } from "@/utils/storage";
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
import SummaryTable from "./multi-freight-receipt/SummaryTable";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";
import { useIsMobile } from "@/hooks/use-mobile";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fix 1: Using the correct syntax for useReactToPrint
  const handlePrint = useReactToPrint({
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    // Using contentRef to specify the element to be printed
    contentRef: componentRef,
  });

  // Fix 2: Create wrapper functions for onClick handlers
  const onPrintClick = useCallback(() => {
    if (handlePrint) {
      handlePrint();
    }
  }, [handlePrint]);

  // Calcular informações necessárias para os componentes
  const freightsByClient = groupFreightsByClient(freights);
  const totalAmount = getTotalAmount(freights);
  const dateRangeText = getDateRangeText(freights);

  const generatePDF = async (): Promise<Blob> => {
    if (!componentRef.current) throw new Error("Elemento de recibo não encontrado");
    
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const canvas = await html2canvas(componentRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
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
        title: "Recibo gerado",
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
      description: "Aguarde enquanto preparamos o documento para compartilhamento..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const file = new File([pdfBlob], `recibo-multiplos-fretes-${new Date().toISOString().slice(0, 10)}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Recibo de Múltiplos Fretes - ${dateRangeText}`,
          text: `Recibo de múltiplos fretes no período de ${dateRangeText}.`,
        });
        
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        
        toast({
          title: "Sucesso",
          description: "Recibo compartilhado com sucesso!"
        });
      } else {
        // Fallback para navegadores que não suportam Web Share API
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

  return (
    <div className="p-2 md:p-4">
      <div className="mb-4 flex justify-end gap-2">
        {isMobile ? (
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
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2"
              >
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
              {/* Fix 3: Use the wrapper function for the onClick handler */}
              <DropdownMenuItem onClick={onPrintClick}>
                <PrinterIcon className="h-4 w-4 mr-2" /> Imprimir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {isMobile && (
          <Button 
            variant="outline" 
            className="gap-2 w-full"
            onClick={onPrintClick} 
          >
            <PrinterIcon className="h-4 w-4" />
            Imprimir
          </Button>
        )}
      </div>
      
      <div 
        ref={componentRef} 
        className={`bg-white p-2 md:p-4 mx-auto max-w-4xl shadow-sm print:shadow-none print:p-0 ${isGenerating ? 'opacity-0 absolute' : ''}`}
      >
        <PrintStyles />
        
        {/* Cabeçalho do recibo com dados da empresa */}
        <ReceiptHeader dateRangeText={dateRangeText} currentUser={currentUser} />
        
        {/* Tabela de resumo de todos os fretes */}
        <SummaryTable freights={freights} />
        
        {/* Seção detalhada por cliente */}
        <ClientDetailsSection freightsByClient={freightsByClient} />
        
        {/* Rodapé com recibo e assinatura */}
        <ReceiptFooter totalAmount={totalAmount} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;
