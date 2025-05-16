
import { QuotationData } from "@/components/quotation/types";
import { generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";
import html2canvas from "html2canvas";
import { prepareQuotationForPdf, restoreQuotationFromPdf, getQuotationMetadata } from "./quotationPdfPrep";

// Generate PDF for a quotation by ID
export const generateQuotationPdf = async (id: string): Promise<boolean> => {
  try {
    // Garantir que o elemento está visível no DOM
    return new Promise((resolve) => {
      setTimeout(async () => {
        const element = document.getElementById("quotation-pdf");
        if (!element) {
          console.error("Quotation PDF element not found");
          resolve(false);
          return;
        }
        
        // Prepare for PDF generation
        const prepared = prepareQuotationForPdf(id);
        if (!prepared) {
          console.error("Failed to prepare quotation for PDF generation");
          resolve(false);
          return;
        }
        
        try {
          // Verificar se estamos em um dispositivo móvel
          const isMobile = window.innerWidth <= 640;
          
          // Se for mobile, definir uma largura fixa para melhorar a renderização
          if (isMobile) {
            element.style.width = "100%";
            element.style.maxWidth = "100%";
            element.style.overflow = "hidden";
          }
          
          // Generate canvas with optimized settings
          const canvas = await html2canvas(element, {
            scale: isMobile ? 1.5 : 3, // Escala aumentada para melhor qualidade
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false, // Disable logging
            imageTimeout: 15000, // Maior timeout para carregar imagens
            onclone: (document, element) => {
              // Ensure all images are loaded before rendering
              element.querySelectorAll('img').forEach(img => {
                if (!img.complete) {
                  img.onload = () => {};
                  img.src = img.src;
                }
              });
              
              // Ajustar elementos para impressão em dispositivos móveis
              if (isMobile) {
                const styles = document.createElement('style');
                styles.innerHTML = `
                  #quotation-pdf {
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 5px !important;
                  }
                  #quotation-pdf * {
                    font-size: 10px !important;
                  }
                  #quotation-pdf h1, #quotation-pdf h2 {
                    font-size: 12px !important;
                  }
                  #quotation-pdf table {
                    table-layout: fixed !important;
                    width: 100% !important;
                  }
                  #quotation-pdf table td {
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                  }
                  #quotation-pdf .grid-cols-2 {
                    grid-template-columns: 1fr !important;
                  }
                `;
                document.head.appendChild(styles);
              }
              
              // Adicionar estilo para garantir tudo em uma página
              const singlePageStyle = document.createElement('style');
              singlePageStyle.innerHTML = `
                #quotation-pdf {
                  max-height: 270mm !important;
                  width: ${isMobile ? '100%' : '210mm'} !important;
                  page-break-inside: avoid !important;
                }
                #quotation-pdf .no-break {
                  page-break-inside: avoid !important;
                }
                #quotation-pdf * {
                  page-break-inside: avoid !important;
                }
              `;
              document.head.appendChild(singlePageStyle);
              
              return element;
            }
          });
          
          // Get quotation metadata
          const { title: quotationTitle, subject: quotationSubject } = getQuotationMetadata(id);
          
          // Generate PDF with optimized settings
          const pdf = generatePdfFromCanvas(canvas, {
            filename: `cotacao-frete-${id}.pdf`,
            title: quotationTitle,
            subject: quotationSubject,
            author: "FreteValor",
            creator: "FreteValor",
            compress: true,
            quality: 0.95, // Alta qualidade de imagem
            fitToPage: true // Ajustar para caber em uma página
          });
          
          // Trigger download
          pdf.save(`cotacao-frete-${id}.pdf`);
          
          // Restore element
          restoreQuotationFromPdf();
          
          resolve(true);
        } catch (error) {
          console.error("Error in PDF generation:", error);
          restoreQuotationFromPdf();
          resolve(false);
        }
      }, 500); // Pequeno delay para garantir que o DOM está pronto
    });
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
    restoreQuotationFromPdf();
    return false;
  }
};

// Preview PDF in a new window
export const previewQuotationPdf = async (quotation: QuotationData | null): Promise<boolean> => {
  if (!quotation) return false;
  
  try {
    const element = document.getElementById("quotation-pdf");
    if (!element) return false;
    
    // Verificar se estamos em um dispositivo móvel
    const isMobile = window.innerWidth <= 640;
    
    // Generate canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: isMobile ? 1.5 : 3, // Escala maior para melhor qualidade
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      imageTimeout: 15000, // Maior timeout para imagens
      onclone: (document, element) => {
        // Ajustar elementos para impressão em dispositivos móveis
        if (isMobile) {
          const styles = document.createElement('style');
          styles.innerHTML = `
            #quotation-pdf {
              width: 100% !important;
              max-width: 100% !important;
              padding: 5px !important;
            }
            #quotation-pdf * {
              font-size: 10px !important;
            }
            #quotation-pdf h1, #quotation-pdf h2 {
              font-size: 12px !important;
            }
            #quotation-pdf table {
              table-layout: fixed !important;
              width: 100% !important;
            }
            #quotation-pdf table td {
              word-break: break-word !important;
              overflow-wrap: break-word !important;
            }
            #quotation-pdf .grid-cols-2 {
              grid-template-columns: 1fr !important;
            }
          `;
          document.head.appendChild(styles);
        }
        
        // Adicionar estilo para garantir tudo em uma página
        const singlePageStyle = document.createElement('style');
        singlePageStyle.innerHTML = `
          #quotation-pdf {
            max-height: 270mm !important;
            width: ${isMobile ? '100%' : '210mm'} !important;
            page-break-inside: avoid !important;
          }
          #quotation-pdf .no-break {
            page-break-inside: avoid !important;
          }
          #quotation-pdf * {
            page-break-inside: avoid !important;
          }
        `;
        document.head.appendChild(singlePageStyle);
        
        return element;
      }
    });
    
    // Generate PDF with optimized metadata
    const pdf = generatePdfFromCanvas(canvas, {
      title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
      subject: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
      author: quotation.creatorName || "FreteValor",
      creator: "FreteValor",
      compress: true,
      quality: 0.95, // Alta qualidade de imagem
      fitToPage: true // Ajustar para caber em uma página
    });
    
    // Open in new window
    openPdfInNewWindow(pdf);
    
    return true;
  } catch (error) {
    console.error("Error previewing quotation PDF:", error);
    return false;
  }
};
