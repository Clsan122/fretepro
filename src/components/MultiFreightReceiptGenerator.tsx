
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { getUser } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { PrinterIcon, Save } from "lucide-react";
import { groupFreightsByClient, getTotalAmount, getDateRangeText } from "@/utils/receipt-helpers";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import ReceiptHeader from "./multi-freight-receipt/ReceiptHeader";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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

  const handlePrint = useReactToPrint({
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    pageStyle: "@page { size: A4; margin: 10mm; }",
    onBeforeGetContent: () => componentRef.current,
  });

  return (
    <div className="p-2 md:p-4">
      <div className="mb-4 flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          Salvar Recibo
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handlePrint}
        >
          <PrinterIcon className="h-4 w-4" />
          Imprimir
        </Button>
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
