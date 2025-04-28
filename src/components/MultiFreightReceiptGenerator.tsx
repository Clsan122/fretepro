import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { getUser } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { PrinterIcon, Save, FileText } from "lucide-react";
import { groupFreightsByClient, getTotalAmount, getDateRangeText } from "@/utils/receipt-helpers";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import ReceiptHeader from "./multi-freight-receipt/ReceiptHeader";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";
import SummaryTable from "./multi-freight-receipt/SummaryTable";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [requesterName, setRequesterName] = useState<string>("");
  
  const dateRangeText = getDateRangeText(freights);
  const totalAmount = getTotalAmount(freights);
  const freightsByClient = groupFreightsByClient(freights);

  const handleSave = () => {
    // Save the receipt data to localStorage
    try {
      const receiptData = {
        freights,
        dateGenerated: new Date().toISOString(),
        totalAmount,
        dateRangeText,
        requesterName,
      };

      // Get existing receipts or initialize empty array
      const existingReceipts = JSON.parse(localStorage.getItem('multiFreightReceipts') || '[]');
      existingReceipts.push(receiptData);
      localStorage.setItem('multiFreightReceipts', JSON.stringify(existingReceipts));

      toast({
        title: "Recibo salvo",
        description: "O recibo foi salvo com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao salvar recibo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o recibo",
        variant: "destructive"
      });
    }
  };

  // Fix the useReactToPrint hook configuration to use the proper type
  const handlePrint = useReactToPrint({
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    pageStyle: "@page { size: A4; margin: 10mm; }",
    contentRef: componentRef,
  });

  const handleGeneratePDF = async () => {
    if (!componentRef.current) return;
    
    setIsGenerating(true);
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const contentElement = componentRef.current;
      const originalWidth = contentElement.style.width;
      contentElement.style.width = '800px';
      
      // Adicionar classe temporária para melhorar a renderização para PDF
      contentElement.classList.add('pdf-generation-mode');
      
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 800,
        backgroundColor: '#FFFFFF'
      });
      
      // Restaurar o elemento ao estado original
      contentElement.style.width = originalWidth;
      contentElement.classList.remove('pdf-generation-mode');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular proporções para ajustar à página
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Salvar o PDF
      pdf.save(`recibo-fretes-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi salvo com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start justify-between">
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <Label htmlFor="requester-name">Nome do Solicitante</Label>
          <Input 
            id="requester-name"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            placeholder="Informe quem está solicitando o recibo"
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handlePrint}
          >
            <PrinterIcon className="h-4 w-4" />
            Imprimir
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4" />
            {isGenerating ? "Gerando..." : "Salvar PDF"}
          </Button>
        </div>
      </div>

      <div 
        ref={componentRef} 
        className={`bg-white p-4 mx-auto max-w-full shadow-sm print:shadow-none print:p-0 print-container ${isGenerating ? 'opacity-0 absolute' : ''}`}
        style={{ width: '100%' }}
      >
        <PrintStyles />
        <ReceiptHeader dateRangeText={dateRangeText} currentUser={currentUser} />
        <ClientDetailsSection freightsByClient={freightsByClient} />
        <SummaryTable freights={freights} />
        <ReceiptFooter 
          totalAmount={totalAmount} 
          currentUser={currentUser}
          requesterName={requesterName} 
        />
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;
