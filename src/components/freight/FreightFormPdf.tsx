import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Freight, User } from '@/types';

interface FreightFormPdfProps {
  formData: Freight | null;
  client: any;
  driver: any;
  user: User | null;
  onClose: () => void;
}

const FreightFormPdf: React.FC<FreightFormPdfProps> = ({ 
  formData, 
  client, 
  driver, 
  user, 
  onClose 
}) => {
  const generatePdf = () => {
    if (!formData) return;

    const doc = new jsPDF();
    
    // Configurações gerais do PDF
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Margens
    const margin = 10;

    // Largura da página
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo da empresa (agora usando avatar do usuário se disponível)
    if (user?.avatar) {
      try {
        doc.addImage(user.avatar, 'JPEG', 150, 10, 40, 30);
      } catch (error) {
        console.warn('Erro ao adicionar logo:', error);
      }
    }

    // Dados da empresa (agora usando dados do usuário)
    doc.setFontSize(14);
    doc.text(user?.name || 'Transportadora', 20, 30);
    if (user?.cpf) {
      doc.setFontSize(10);
      doc.text(`CPF: ${user.cpf}`, 20, 40);
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
    doc.text(`Origem: ${formData.originCity}, ${formData.originState}`, margin, y);
    y += lineHeight;
    doc.text(`Destino: ${formData.destinationCity}, ${formData.destinationState}`, margin, y);
    y += lineHeight;
    doc.text(`Data de Partida: ${new Date(formData.departureDate).toLocaleDateString('pt-BR')}`, margin, y);
    y += lineHeight;
    doc.text(`Data de Chegada: ${new Date(formData.arrivalDate).toLocaleDateString('pt-BR')}`, margin, y);
    y += lineHeight;

    // Detalhes financeiros
    doc.setFontSize(14);
    doc.text('Detalhes Financeiros', margin, y + 10);
    y += 20;

    doc.setFontSize(12);
    doc.text(`Valor do Frete: R$ ${formData.freightValue.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.text(`Taxa Diária: R$ ${formData.dailyRate.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.text(`Outros Custos: R$ ${formData.otherCosts.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.text(`Custos de Pedágio: R$ ${formData.tollCosts.toFixed(2)}`, margin, y);
    y += lineHeight;
    doc.setFontSize(13);
    doc.text(`Valor Total: R$ ${formData.totalValue.toFixed(2)}`, margin, y);

    // Adicione a tabela de despesas se existirem
    if (formData.expenses && formData.expenses.length > 0) {
      const expensesData = formData.expenses.map(expense => [
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
    doc.text(formData.cargoDescription || 'Nenhuma observação.', margin, doc.internal.pageSize.getHeight() - 20);

    // Salvar o PDF
    doc.save(`freight-form-${formData.id}.pdf`);
    onClose();
  };

  return (
    <div>
      <button onClick={generatePdf}>Gerar PDF</button>
    </div>
  );
};

export default FreightFormPdf;
