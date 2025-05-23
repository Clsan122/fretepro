
import { QuotationData } from "@/components/quotation/types";

// Store the original quotation data before printing
let originalQuotationData: QuotationData | null = null;

// Prepare quotation for printing
export const prepareQuotationForPdf = (id: string): QuotationData | null => {
  const container = document.getElementById("quotation-pdf");
  if (!container) return null;
  
  container.classList.add('print-mode');
  
  try {
    // Attempt to get quotation data from localStorage
    const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    const quotation = storedQuotations.find((q: any) => q.id === id);
    
    if (quotation) {
      originalQuotationData = { ...quotation };
      return quotation;
    }
    return null;
  } catch (error) {
    console.error("Error preparing quotation for PDF:", error);
    return null;
  }
};

// Restore after printing
export const restoreQuotationFromPdf = (): void => {
  const container = document.getElementById("quotation-pdf");
  if (!container) return;
  
  container.classList.remove('print-mode');
  originalQuotationData = null;
};

// Helper to get quotation metadata from localStorage
export const getQuotationMetadata = (id: string): { 
  title: string; 
  subject: string;
} => {
  let quotationTitle = "Cotação de Frete";
  let quotationSubject = "Cotação de Serviço de Transporte";
  
  try {
    const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    const quotation = storedQuotations.find((q: any) => q.id === id);
    
    if (quotation) {
      quotationTitle = `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`;
      quotationSubject = `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`;
    }
  } catch (error) {
    console.error("Error getting quotation data for PDF metadata:", error);
  }
  
  return {
    title: quotationTitle,
    subject: quotationSubject
  };
};

// Print mode functions
export const prepareForPrintMode = (
  containerId: string = "quotation-content"
): boolean => {
  // Configure container for print
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  // Apply print mode class
  container.classList.add('print-mode');
  
  // Apply specific optimizations for better PDF fitting
  document.body.style.zoom = "0.85"; // Adjust zoom for better fit
  
  return true;
};

export const restoreFromPrintMode = (
  containerId: string = "quotation-content"
): void => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Remove print mode class
  container.classList.remove('print-mode');
  
  // Restore zoom
  document.body.style.zoom = "";
};
