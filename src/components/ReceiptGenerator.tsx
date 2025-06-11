
import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from '@/utils/formatters';
import { User as AuthUser } from '@/context/auth/types';
import { Freight, Client, Driver } from '@/types';

interface ReceiptGeneratorProps {
  freight?: Freight;
  freights?: Freight[];
  clients?: Client[];
  user: AuthUser;
  driver?: Driver;
  onClose?: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ 
  freight, 
  freights, 
  clients, 
  user, 
  driver, 
  onClose 
}) => {
  const { toast } = useToast();
  const pdfRef = useRef(null);

  const generatePdf = () => {
    const freightList = freights || (freight ? [freight] : []);
    
    if (!user || freightList.length === 0) return;

    const doc = new jsPDF();

    // Configurações de estilo
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.setLineWidth(0.2);

    // Cabeçalho com dados do usuário
    doc.setFontSize(16);
    doc.text(user.name || 'Usuário', 20, 30);

    if (user.cpf) {
      doc.setFontSize(10);
      doc.text(`CPF: ${user.cpf}`, 20, 40);
    }

    // Tabela de fretes
    const tableColumn = ["ID", "Origem", "Destino", "Valor"];
    const tableRows: any[] = [];

    freightList.forEach((freightItem) => {
      tableRows.push([
        freightItem.id,
        `${freightItem.originCity} - ${freightItem.originState}`,
        `${freightItem.destinationCity} - ${freightItem.destinationState}`,
        formatCurrency(freightItem.freightValue)
      ]);
    });

    // Adiciona a tabela ao PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: { 0: { halign: 'center' } }
    });

    // Calcular valor total dos fretes
    const totalValue = freightList.reduce((acc, freightItem) => acc + freightItem.freightValue, 0);

    // Adicionar o valor total ao PDF
    doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(totalValue)}`, 20, (doc as any).autoTable.previous.finalY + 10);

    // Rodapé - using correct jsPDF API
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() - 40,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Salvar o PDF
    try {
      doc.save(`recibo_de_fretes_${new Date().toLocaleDateString()}.pdf`);
      if (onClose) onClose();
    } catch (error) {
      console.error("Erro ao salvar o PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Houve um problema ao gerar o PDF. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div ref={pdfRef} className="receipt-generator">
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={generatePdf}>
          Gerar PDF
        </Button>
        {onClose && (
          <DialogClose asChild>
            <Button variant="secondary">Fechar</Button>
          </DialogClose>
        )}
      </div>
    </div>
  );
};

export default ReceiptGenerator;
