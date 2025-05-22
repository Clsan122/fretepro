
import React from "react";
import { QuotationData } from "./types";
import { FreightQuotationPdf } from "./FreightQuotationPdf";
import { useAuth } from "@/context/AuthContext";

interface QuotationPdfDocumentProps {
  quotation: QuotationData;
}

export const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({ quotation }) => {
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
    <FreightQuotationPdf
      quotation={quotation}
      creatorInfo={creatorInfo}
    />
  );
};
