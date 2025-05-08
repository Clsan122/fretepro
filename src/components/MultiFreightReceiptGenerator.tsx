
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Freight, Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientById } from "@/utils/storage";
import { format } from "date-fns";
import ReceiptHeader from "./multi-freight-receipt/ReceiptHeader";
import SummaryTable from "./multi-freight-receipt/SummaryTable";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import { groupFreightsByClient, getDateRangeText } from "@/utils/receipt-helpers";
import { generateMultiFreightReceiptPdf } from "@/utils/pdf";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Find client info from the first freight
  React.useEffect(() => {
    if (freights.length > 0 && freights[0].clientId) {
      const clientData = getClientById(freights[0].clientId);
      if (clientData) {
        setClient(clientData);
      }
    }
  }, [freights]);

  // Calculate total amount
  const totalAmount = freights.reduce((sum, freight) => sum + freight.totalValue, 0);
  
  // Extract payment info from first freight or use defaults
  const requesterName = freights.length > 0 ? freights[0].requesterName : undefined;
  const paymentTerm = freights.length > 0 ? freights[0].paymentTerm : undefined;

  // Get formatted date range for the receipt
  const dateRangeText = getDateRangeText(freights);

  // Group freights by client for better organization in the receipt
  const freightsByClient = groupFreightsByClient(freights);

  // Setup print function
  const handlePrint = useReactToPrint({
    documentTitle: "Recibo-Multiple-Fretes",
    // Fix: Use proper property name according to useReactToPrint API
    contentRef: printRef,
  });
  
  // Setup PDF generation
  const handleGeneratePdf = async () => {
    const freightIds = freights.map(f => f.id);
    await generateMultiFreightReceiptPdf(freightIds);
  };

  // Setup PDF preview
  const handlePreviewPdf = async () => {
    try {
      const printElement = document.getElementById("multi-receipt-container");
      if (!printElement) {
        console.error("Elemento de recibo múltiplo não encontrado");
        return;
      }
      
      // Use window.print() para visualização
      // Isto será substituído pela função de visualização específica quando disponível
      window.print();
    } catch (error) {
      console.error("Erro ao pré-visualizar PDF:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="p-4 mb-4 flex flex-wrap justify-between items-center border-b gap-2">
        <h1 className="text-xl font-bold">Recibo de Múltiplos Fretes</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="gap-2" size="sm">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleGeneratePdf} variant="outline" className="gap-2" size="sm">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button onClick={handlePreviewPdf} variant="outline" className="gap-2" size="sm">
            <FileText className="h-4 w-4" />
            Visualizar
          </Button>
        </div>
      </div>

      {/* Este div será impresso */}
      <div ref={printRef} className="p-6 bg-white print:p-0" id="multi-receipt-container">
        <PrintStyles />
        
        <div className="max-w-4xl mx-auto">
          <ReceiptHeader 
            dateRangeText={dateRangeText}
            currentUser={user} 
          />
          
          <ClientDetailsSection 
            freightsByClient={freightsByClient} 
          />
          
          <SummaryTable 
            freights={freights} 
          />
          
          <ReceiptFooter 
            totalAmount={totalAmount} 
            currentUser={user}
            requesterName={requesterName}
            paymentTerm={paymentTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;
