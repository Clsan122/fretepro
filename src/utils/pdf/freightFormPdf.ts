import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateFreightFormPdf = (formData: any, client: any, driver: any, user: any) => {
  const doc = new jsPDF();

  // Configurações gerais do documento
  doc.setFontSize(12);
  doc.setTextColor(40);

  // Usar nome do usuário em vez de companyName
  const transporterName = user?.name || 'Transportadora';

  // Título do formulário
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text('Formulário de Frete', 105, 20, { align: 'center' });

  // Informações do Cliente
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Cliente', 14, 35);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${client?.name || 'Não informado'}`, 14, 45);
  doc.text(`Email: ${client?.email || 'Não informado'}`, 14, 52);
  doc.text(`Telefone: ${client?.phone || 'Não informado'}`, 14, 59);
  doc.text(`Endereço: ${client?.address || 'Não informado'}`, 14, 66);

  // Informações do Motorista
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Motorista', 14, 80);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${driver?.name || 'Não informado'}`, 14, 90);
  doc.text(`Email: ${driver?.email || 'Não informado'}`, 14, 97);
  doc.text(`Telefone: ${driver?.phone || 'Não informado'}`, 14, 104);
  doc.text(`Placa do Veículo: ${driver?.licensePlate || 'Não informado'}`, 14, 111);

  // Informações do Frete
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Frete', 14, 125);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cidade de Origem: ${formData?.originCity || 'Não informado'}`, 14, 135);
  doc.text(`Estado de Origem: ${formData?.originState || 'Não informado'}`, 14, 142);
  doc.text(`Cidade de Destino: ${formData?.destinationCity || 'Não informado'}`, 14, 149);
  doc.text(`Estado de Destino: ${formData?.destinationState || 'Não informado'}`, 14, 156);
  doc.text(`Data de Partida: ${formData?.departureDate || 'Não informado'}`, 14, 163);
  doc.text(`Data de Chegada: ${formData?.arrivalDate || 'Não informado'}`, 14, 170);

  // Valores do Frete
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Valores do Frete', 14, 184);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Valor do Frete: ${formData?.freightValue || 'Não informado'}`, 14, 194);
  doc.text(`Taxa Diária: ${formData?.dailyRate || 'Não informado'}`, 14, 201);
  doc.text(`Outros Custos: ${formData?.otherCosts || 'Não informado'}`, 14, 208);
  doc.text(`Custos de Pedágio: ${formData?.tollCosts || 'Não informado'}`, 14, 215);
  doc.text(`Valor Total: ${formData?.totalValue || 'Não informado'}`, 14, 222);

  // Informações da Transportadora
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações da Transportadora', 14, 236);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${transporterName || 'Não informado'}`, 14, 246);
  doc.text(`Email: ${user?.email || 'Não informado'}`, 14, 253);
  doc.text(`Telefone: ${user?.phone || 'Não informado'}`, 14, 260);

  // Retorna o documento PDF
  return doc.output('datauristring');
};
