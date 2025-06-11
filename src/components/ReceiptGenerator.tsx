import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Freight, User } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ReceiptGeneratorProps {
  freights: Freight[];
  onClose: () => void;
  user: User | null;
}

const ReceiptGenerator = ({ freights, onClose, user }: ReceiptGeneratorProps) => {
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePdf = () => {
    if (!user || freights.length === 0) return;

    const doc = new jsPDF();

    // Configurações de estilo
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.setLineWidth(0.2);

    // Cabeçalho com dados do usuário (não mais empresa)
    doc.setFontSize(16);
    doc.text(user.name || 'Usuário', 20, 30);
    if (user.cpf) {
      doc.setFontSize(10);
      doc.text(`CPF: ${user.cpf}`, 20, 40);
    }

    // Tabela de fretes
    const tableColumn = ["ID", "Origem", "Destino", "Valor"];
    const tableRows: string[][] = [];

    freights.forEach(freight => {
      tableRows.push([
        freight.id,
        `${freight.originCity} - ${freight.originState}`,
        `${freight.destinationCity} - ${freight.destinationState}`,
        formatCurrency(freight.freightValue)
      ]);
    });

    // Adiciona a tabela ao PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: { 0: { halign: 'center' } },
    });

    // Calcular valor total dos fretes
    const totalValue = freights.reduce((acc, freight) => acc + freight.freightValue, 0);

    // Adicionar o valor total ao PDF
    doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(totalValue)}`, 20, (doc as any).autoTable.previous.finalY + 10);

    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
    }

    // Salvar o PDF
    try {
      doc.save(`recibo_de_fretes_${new Date().toLocaleDateString()}.pdf`);
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
        <DialogClose asChild>
          <Button variant="secondary">
            Fechar
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
