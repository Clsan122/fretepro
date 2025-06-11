import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Quotation } from '@/types';

interface QuotationPdfDocumentProps {
  quotationData: Quotation;
  user: any;
}

const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({ 
  quotationData, 
  user 
}) => {
  const generatePdf = () => {
    const doc = new jsPDF();
    
    // Dados da empresa (agora usando dados do usuário)
    const companyName = user?.name || 'Transportadora';
    const companyCpf = user?.cpf || '';

    doc.setFontSize(20);
    doc.text(`Cotação de Frete`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Emitido por: ${companyName}`, 20, 30);
    doc.text(`CPF: ${companyCpf}`, 20, 35);
    doc.text(`Data de emissão: ${new Date().toLocaleDateString()}`, 20, 40);

    const columns = [
      { title: "Origem", dataKey: "origin" },
      { title: "Destino", dataKey: "destination" },
      { title: "Volumes", dataKey: "volumes" },
      { title: "Peso (kg)", dataKey: "weight" },
      { title: "Tipo de Carga", dataKey: "cargoType" },
      { title: "Tipo de Veículo", dataKey: "vehicleType" },
      { title: "Preço Total (R$)", dataKey: "totalPrice" },
    ];

    const data = [
      {
        origin: `${quotationData.originCity}, ${quotationData.originState}`,
        destination: `${quotationData.destinationCity}, ${quotationData.destinationState}`,
        volumes: quotationData.volumes,
        weight: quotationData.weight,
        cargoType: quotationData.cargoType,
        vehicleType: quotationData.vehicleType,
        totalPrice: quotationData.totalPrice.toFixed(2),
      },
    ];

    (doc as any).autoTable(columns, data, {
      startY: 50,
      margin: { horizontal: 20 },
    });

    doc.setFontSize(14);
    doc.text(`Observações: ${quotationData.notes || 'Nenhuma'}`, 20, (doc as any).autoTable.previous.finalY + 10);

    doc.save(`cotacao_frete_${new Date().toISOString()}.pdf`);
  };

  return (
    <button onClick={generatePdf}>
      Gerar PDF
    </button>
  );
};

export default QuotationPdfDocument;
