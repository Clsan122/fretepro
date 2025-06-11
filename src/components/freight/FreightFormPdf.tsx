
import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Freight, Client, Driver } from '@/types';
import { User as AuthUser } from '@/context/auth/types';

interface FreightFormPdfProps {
  freight: Freight;
  client: Client | null;
  driver: Driver | null;
  sender: AuthUser;
}

const FreightFormPdf: React.FC<FreightFormPdfProps> = ({ 
  freight, 
  client, 
  driver, 
  sender
}) => {
  const generatePdf = () => {
    if (!freight) return;

    const doc = new jsPDF();
    
    // Configurações gerais do PDF
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Margens
    const margin = 10;

    // Largura da página
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo da empresa (agora usando avatar do usuário se disponível)
    if (sender?.avatar) {
      try {
        doc.addImage(sender.avatar, 'JPEG', 150, 10, 40, 30);
      } catch (error) {
        console.warn('Erro ao adicionar logo:', error);
      }
    }

    // Dados da empresa (agora usando dados do usuário)
    doc.setFontSize(14);
    doc.text(sender?.name || 'Transportadora', 20, 30);
    if (sender?.cpf) {
      doc.setFontSize(10);
      doc.text(`CPF: ${sender.cpf}`, 20, 40);
    }

    // Título do formulário
    doc.setFontSize(16);
    doc.text('Formulário de Frete', margin, 50);

    // Informações do frete
    let y = 60;
    const lineHeight = 8;

    doc.setFontSize(12);
    doc.text(`Cliente: ${client?.name || 'Não informado'}`, margin, y);
    y += lineHeight;
    doc.text(`Motorista: ${driver?.name || 'Não informado'}`, margin, y);
    y += lineHeight;
    doc.text(`Origem: ${freight.originCity}, ${freight.originState}`, margin, y);
    y += lineHeight;
    doc.text(`Destino: ${freight.destinationCity}, ${freight.destinationState}`, margin, y);
    y += lineHeight;
    doc.text(`Data de Partida: ${new Date(freight.departureDate).toLocaleDateString('pt-BR')}`, margin, y);
    y += lineHeight;
    doc.text(`Data de Chegada: ${new Date(freight.arrivalDate).toLocaleDateString('pt-BR')}`, margin, y);
    y += lineHeight;

    // Detalhes financeiros
    doc.setFontSize(14);
    doc.text('Detalhes Financeiros', margin, y + 10);
    y += 20;

    doc.setFontSize(12);
    doc.text(`Valor do Frete: R$ ${freight.freightValue.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.text(`Taxa Diária: R$ ${freight.dailyRate.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.text(`Outros Custos: R$ ${freight.otherCosts.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.text(`Custos de Pedágio: R$ ${freight.tollCosts.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.setFontSize(13);
    doc.text(`Valor Total: R$ ${freight.totalValue.toFixed(2)}`, margin, y);

    // Adicione a tabela de despesas se existirem
    if (freight.expenses && freight.expenses.length > 0) {
      const expensesData = freight.expenses.map(expense => [
        expense.type,
        expense.description,
        `R$ ${expense.value.toFixed(2)}`,
        new Date(expense.createdAt).toLocaleDateString('pt-BR')
      ]);

      (doc as any).autoTable({
        head: [['Tipo', 'Descrição', 'Valor', 'Data']],
        body: expensesData,
        startY: y + 20,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        didParseCell: function(data: any) {
          if (data.section === 'head') {
            data.cell.styles.fontStyle = 'bold';
          }
        },
      });
    }

    // Notas adicionais
    doc.setFontSize(12);
    doc.text('Observações:', margin, doc.internal.pageSize.getHeight() - 30);
    doc.text(freight.cargoDescription || 'Nenhuma observação.', margin, doc.internal.pageSize.getHeight() - 20);

    // Salvar o PDF
    doc.save(`freight-form-${freight.id}.pdf`);
  };

  return (
    <div id="freight-form-print" className="p-6 bg-white">
      {/* PDF content would be rendered here for print preview */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Formulário de Frete</h1>
      </div>
      {/* Content for PDF generation */}
    </div>
  );
};

export default FreightFormPdf;
