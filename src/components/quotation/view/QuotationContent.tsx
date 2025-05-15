
import React from "react";
import { Card } from "@/components/ui/card";
import { QuotationPdfDocument } from "@/components/quotation/QuotationPdfDocument";
import { QuotationData } from "@/components/quotation/types";

interface QuotationContentProps {
  quotation: QuotationData;
}

const QuotationContent: React.FC<QuotationContentProps> = ({ quotation }) => {
  return (
    <div className="print-container">
      <Card className="p-6 shadow-md print-no-shadow">
        <QuotationPdfDocument quotation={quotation} />
      </Card>
    </div>
  );
};

export default QuotationContent;
