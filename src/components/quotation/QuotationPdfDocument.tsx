
import React, { useEffect } from "react";
import { QuotationData } from "./types";
import { FreightQuotationPdf } from "./FreightQuotationPdf";
import { useAuth } from "@/context/AuthContext";

interface QuotationPdfDocumentProps {
  quotation: QuotationData;
}

/**
 * Detects Safari mobile for specific styling
 */
const isSafariMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent;
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isMobile = /iPhone|iPad|iPod/.test(userAgent);
  return isSafari && isMobile;
};

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

  // Apply Safari mobile optimizations
  useEffect(() => {
    if (isSafariMobile()) {
      // Add Safari-specific styles
      const style = document.createElement('style');
      style.id = 'safari-mobile-pdf-styles';
      style.innerHTML = `
        #quotation-pdf {
          -webkit-font-smoothing: antialiased !important;
          -webkit-transform: translateZ(0) !important;
          -webkit-backface-visibility: hidden !important;
          width: 210mm !important;
          max-width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 auto !important;
          background: white !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
        
        #quotation-pdf * {
          -webkit-font-smoothing: antialiased !important;
          box-sizing: border-box !important;
        }
        
        #quotation-pdf img {
          max-width: 100% !important;
          height: auto !important;
          -webkit-transform: translateZ(0) !important;
        }
        
        @media screen and (max-width: 768px) {
          #quotation-pdf {
            transform: scale(0.8) !important;
            transform-origin: top left !important;
            width: 262.5mm !important;
          }
        }
      `;
      
      document.head.appendChild(style);
      
      // Cleanup on unmount
      return () => {
        const existingStyle = document.getElementById('safari-mobile-pdf-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  return (
    <FreightQuotationPdf
      quotation={quotation}
      creatorInfo={creatorInfo}
    />
  );
};
