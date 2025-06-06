
import { useState } from "react";
import { CollectionOrder } from "@/types";
import { generateCollectionOrderPdf } from "@/utils/pdf/collectionOrderPdf";
import { useToast } from "@/hooks/use-toast";

export const useCollectionOrderPdf = (order: CollectionOrder | null, id?: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (options: { 
    savePdf?: boolean; 
    openInNewTab?: boolean;
    filename?: string;
  } = {}): Promise<Blob> => {
    if (!order) {
      throw new Error("Ordem não disponível para geração de PDF");
    }
    
    setIsGenerating(true);
    
    try {
      const pdfBlob = await generateCollectionOrderPdf(
        'collection-order-print', 
        order,
        options
      );
      return pdfBlob;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!order) {
      toast({
        title: "Erro",
        description: "Ordem não disponível para compartilhamento",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando documento",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      // Gerar versão HTML para visualização
      openHtmlPreview();
      
      // Se o dispositivo suporta Web Share API, também oferecemos essa opção
      if (navigator.share) {
        // Também gerar o PDF em segundo plano
        const pdfBlob = await generatePDF();
        const filename = `ordem-coleta-${order.orderNumber || 'nova'}.pdf`;
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });

        // Verificar se podemos compartilhar arquivos
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Ordem de Coleta - ${order.originCity} para ${order.destinationCity}`,
            text: `Ordem de coleta para transporte de ${order.originCity}/${order.originState} para ${order.destinationCity}/${order.destinationState}`,
          });
          
          toast({
            title: "Sucesso",
            description: "Documento compartilhado com sucesso!"
          });
        }
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast({
        title: "Visualização gerada",
        description: "O documento foi aberto em uma nova aba"
      });
    }
  };
  
  const handleDownload = async () => {
    if (!order) {
      toast({
        title: "Erro",
        description: "Ordem não disponível para download",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento para download..."
    });
    
    try {
      const filename = `ordem-coleta-${order.orderNumber || 'nova'}.pdf`;
      await generatePDF({
        savePdf: true,
        filename
      });
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi baixado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
    }
  };
  
  const handlePreview = async () => {
    if (!order) {
      toast({
        title: "Erro",
        description: "Ordem não disponível para visualização",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando Pré-visualização",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      await generatePDF({ openInNewTab: true });
      
      toast({
        title: "Pré-visualização gerada",
        description: "O documento foi aberto em uma nova aba"
      });
    } catch (error) {
      console.error("Erro ao gerar pré-visualização do PDF:", error);
      toast({
        title: "Erro", 
        description: "Não foi possível gerar a pré-visualização",
        variant: "destructive"
      });
    }
  };
  
  const handlePrint = () => {
    if (window && window.print) {
      window.print();
    } else {
      toast({
        title: "Erro",
        description: "Função de impressão não disponível",
        variant: "destructive"
      });
    }
  };

  // Função aprimorada para abrir visualização HTML
  const openHtmlPreview = () => {
    if (!order) return;

    try {
      // Obter o conteúdo do elemento do documento
      const element = document.getElementById('collection-order-print');
      if (!element) {
        throw new Error("Elemento de impressão não encontrado");
      }

      // Obter os estilos atuais da página
      const styleSheets = document.styleSheets;
      let styles = '';
      
      // Coletar todos os estilos da página
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const cssRules = styleSheets[i].cssRules || styleSheets[i].rules;
          if (cssRules) {
            for (let j = 0; j < cssRules.length; j++) {
              styles += cssRules[j].cssText + '\n';
            }
          }
        } catch (e) {
          console.warn('Não foi possível acessar stylesheet', e);
        }
      }

      // Criar uma nova janela com o conteúdo formatado
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        throw new Error("Não foi possível abrir uma nova janela");
      }
      
      // Cabeçalho da ordem de coleta
      const orderTitle = `Ordem de Coleta nº ${order.orderNumber} - ${order.originCity} para ${order.destinationCity}`;
      
      // Escrever o HTML na nova janela com layout aprimorado
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${orderTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${styles}
            @media print {
              body {
                font-size: 10px !important;
                line-height: 1.2 !important;
                color: black !important;
                background: white !important;
              }
              .print-exclude, .print-hide {
                display: none !important;
              }
              .card {
                border: 0.1mm solid #eaeaea !important;
                margin-bottom: 2mm !important;
              }
              .actions-bar {
                display: none !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              max-width: 800px;
              margin: 0 auto;
              background: #f8f8f8;
            }
            #print-container {
              background: white;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .actions-bar {
              position: sticky;
              top: 0;
              z-index: 100;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 15px;
              background: #fff;
              border-bottom: 1px solid #e0e0e0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .btn {
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              transition: background 0.3s;
              margin-left: 8px;
            }
            .btn-primary {
              background: #606;
              color: white;
            }
            .btn-primary:hover {
              background: #505;
            }
            .btn-secondary {
              background: #e0e0e0;
              color: #333;
            }
            .btn-secondary:hover {
              background: #d0d0d0;
            }
            .btn-group {
              display: flex;
              gap: 8px;
            }
            .logo {
              max-height: 60px;
              margin-bottom: 10px;
            }
            .document-info {
              background-color: #f9f9f9;
              padding: 8px 15px;
              margin-bottom: 15px;
              border-radius: 4px;
              border-left: 3px solid #606;
            }
            .document-info p {
              margin: 3px 0;
              font-size: 14px;
            }
            .document-info .title {
              font-weight: bold;
              color: #606;
            }
            @media (max-width: 600px) {
              body {
                padding: 10px;
              }
              #print-container {
                padding: 10px;
              }
              .actions-bar {
                flex-direction: column;
                gap: 10px;
                position: relative;
              }
              .btn-group {
                width: 100%;
                justify-content: space-between;
              }
              .btn {
                padding: 6px 12px;
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="actions-bar print-exclude">
            <h1>${orderTitle}</h1>
            <div class="btn-group">
              <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
              <button class="btn btn-secondary" onclick="window.close()">Fechar</button>
            </div>
          </div>
          
          <div class="document-info print-exclude">
            <p class="title">Informações do Documento</p>
            <p><strong>Origem:</strong> ${order.originCity}/${order.originState}</p>
            <p><strong>Destino:</strong> ${order.destinationCity}/${order.destinationState}</p>
            <p><strong>Data de Emissão:</strong> ${new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Remetente:</strong> ${order.shipper || '-'}</p>
            <p><strong>Destinatário:</strong> ${order.recipient || '-'}</p>
          </div>
          
          <div id="print-container">
            ${element.outerHTML}
          </div>
          <script>
            // Script para ajustar a visualização
            document.addEventListener('DOMContentLoaded', function() {
              // Remover classes que possam interferir na visualização
              const printContainer = document.getElementById('print-container');
              const allElements = printContainer.querySelectorAll('*');
              for (let el of allElements) {
                if (el.classList.contains('print-exclude') || el.classList.contains('print-hide')) {
                  el.style.display = 'none';
                }
              }
              
              // Adicionar data e hora de visualização no topo
              const infoBar = document.createElement('div');
              infoBar.style.fontSize = '12px';
              infoBar.style.color = '#666';
              infoBar.style.textAlign = 'right';
              infoBar.style.padding = '5px 0';
              infoBar.style.marginBottom = '10px';
              infoBar.innerHTML = 'Visualizado em: ' + new Date().toLocaleString('pt-BR');
              printContainer.insertBefore(infoBar, printContainer.firstChild);
            });
          </script>
        </body>
        </html>
      `);
      
      newWindow.document.close();
    } catch (error) {
      console.error("Erro ao gerar visualização HTML:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a visualização HTML",
        variant: "destructive"
      });
    }
  };

  return {
    isGenerating,
    handleShare,
    handleDownload,
    handlePreview,
    handlePrint,
    openHtmlPreview
  };
};
