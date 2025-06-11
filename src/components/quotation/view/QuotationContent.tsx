
import React from "react";
import { FreightQuotationPdf } from "../FreightQuotationPdf";
import { PrintPreviewStyles } from "../PrintPreviewStyles";
import { QuotationData } from "../types";
import { useAuth } from "@/context/AuthContext";

interface QuotationContentProps {
  quotation: QuotationData;
}

const QuotationContent: React.FC<QuotationContentProps> = ({ quotation }) => {
  const { user } = useAuth();
  
  // Prepare creator info from user data
  const creatorInfo = {
    name: user?.companyName || quotation.creatorName || user?.name || "",
    document: user?.cnpj || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || ""
  };
  
  return (
    <div id="quotation-content" data-quotation={JSON.stringify(quotation)}>
      <PrintPreviewStyles />
      <FreightQuotationPdf
        quotation={quotation}
        creatorInfo={creatorInfo}
      />
    </div>
  );
};

export default QuotationContent;
