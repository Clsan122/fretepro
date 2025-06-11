
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Freight, Client, Driver, User } from '@/types';

export const generateFreightFormPdf = (elementId: string, freight: Freight, options: { sender: User }) => {
  const doc = new jsPDF();
  const { sender } = options;

  // Configurações gerais do documento
  doc.setFontSize(12);
  doc.setTextColor(40);

  // Usar nome do usuário em vez de companyName
  const transporterName = sender?.name || 'Transportadora';

  // Título do formulário
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text('Formulário de Frete', 105, 20, { align: 'center' });

  // Informações do Frete
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Frete', 14, 35);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cidade de Origem: ${freight?.originCity || 'Não informado'}`, 14, 45);
  doc.text(`Estado de Origem: ${freight?.originState || 'Não informado'}`, 14, 52);
  doc.text(`Cidade de Destino: ${freight?.destinationCity || 'Não informado'}`, 14, 59);
  doc.text(`Estado de Destino: ${freight?.destinationState || 'Não informado'}`, 14, 66);
  doc.text(`Data de Partida: ${freight?.departureDate || 'Não informado'}`, 14, 73);
  doc.text(`Data de Chegada: ${freight?.arrivalDate || 'Não informado'}`, 14, 80);

  // Valores do Frete
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Valores do Frete', 14, 94);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Valor do Frete: R$ ${freight?.freightValue?.toFixed(2) || '0,00'}`, 14, 104);
  doc.text(`Taxa Diária: R$ ${freight?.dailyRate?.toFixed(2) || '0,00'}`, 14, 111);
  doc.text(`Outros Custos: R$ ${freight?.otherCosts?.toFixed(2) || '0,00'}`, 14, 118);
  doc.text(`Custos de Pedágio: R$ ${freight?.tollCosts?.toFixed(2) || '0,00'}`, 14, 125);
  doc.text(`Valor Total: R$ ${freight?.totalValue?.toFixed(2) || '0,00'}`, 14, 132);

  // Informações da Transportadora
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações da Transportadora', 14, 146);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${transporterName || 'Não informado'}`, 14, 156);
  doc.text(`Email: ${sender?.email || 'Não informado'}`, 14, 163);
  doc.text(`Telefone: ${sender?.phone || 'Não informado'}`, 14, 170);

  // Retorna o documento PDF como blob
  return doc.output('blob');
};

export const exportFreightFormPdf = async (elementId: string, freight: Freight, sender: User): Promise<void> => {
  try {
    const pdfBlob = await generateFreightFormPdf(elementId, freight, { sender });
    
    // Criar nome do arquivo
    const clientName = freight.clientId || 'cliente';
    const fileName = `frete-${clientName}.pdf`;
    
    // Criar URL e fazer download
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw error;
  }
};
