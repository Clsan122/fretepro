
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { getUser } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import { 
  groupFreightsByClient, 
  getTotalAmount, 
  getDateRangeText 
} from "@/utils/receipt-helpers";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import ReceiptHeader from "./multi-freight-receipt/ReceiptHeader";
import SummaryTable from "./multi-freight-receipt/SummaryTable";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();

  const handlePrint = useReactToPrint({
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    contentRef: componentRef,
  });

  // Calcular informações necessárias para os componentes
  const freightsByClient = groupFreightsByClient(freights);
  const totalAmount = getTotalAmount(freights);
  const dateRangeText = getDateRangeText(freights);

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={() => handlePrint()}
          variant="outline" 
          className="gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          Imprimir Recibo
        </Button>
      </div>
      
      <div ref={componentRef} className="bg-white p-4 mx-auto max-w-4xl shadow-sm print:shadow-none print:p-0">
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
