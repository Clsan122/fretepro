
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
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

  const handlePrint = useReactToPrint({
    documentTitle: "Recibo-Multiple-Fretes",
    contentRef: printRef,
    onAfterPrint: () => {
      console.log("Printing completed");
    },
  });

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="p-4 mb-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold">Recibo de Múltiplos Fretes</h1>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir Recibo
        </Button>
      </div>

      {/* This div will be printed */}
      <div ref={printRef} className="p-6 bg-white print:p-0">
        <PrintStyles />
        
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
  );
};

export default MultiFreightReceiptGenerator;
