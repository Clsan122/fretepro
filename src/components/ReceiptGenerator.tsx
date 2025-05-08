
import React, { useRef } from "react";
import { Freight, Client, User, Driver } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { generateFreightReceiptPdf, previewFreightReceiptPdf } from "@/utils/pdf";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import { useReactToPrint } from "react-to-print";

interface ReceiptGeneratorProps {
  freight: Freight;
  clients: Client[];
  user: User | null;
  driver?: Driver;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ freight, clients, user, driver }) => {
  const client = clients.length > 0 ? clients[0] : null;
  const printRef = useRef<HTMLDivElement>(null);
  
  // Calcular valores em texto para exibição
  const totalValueText = freight.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const amountInWords = freight.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim();
  
  // Configurar a função de impressão
  const handlePrint = useReactToPrint({
    documentTitle: `Recibo-Frete-${freight.id}`,
    content: () => printRef.current,
  });

  // Manipulador para gerar PDF
  const handleGeneratePdf = async () => {
    await generateFreightReceiptPdf(freight.id);
  };
  
  // Manipulador para pré-visualizar PDF
  const handlePreviewPdf = async () => {
    await previewFreightReceiptPdf(freight.id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="p-4 mb-4 flex flex-wrap justify-between items-center border-b gap-2">
        <h1 className="text-xl font-bold">Recibo de Frete</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="gap-2" size="sm">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleGeneratePdf} variant="outline" className="gap-2" size="sm">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button onClick={handlePreviewPdf} variant="outline" className="gap-2" size="sm">
            <FileText className="h-4 w-4" />
            Visualizar PDF
          </Button>
        </div>
      </div>

      {/* Este div será impresso/exportado para PDF */}
      <div ref={printRef} className="p-6 bg-white print:p-0" id="receipt-container">
        <PrintStyles />
        
        {/* Cabeçalho com logo e informações da empresa */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">RECIBO DE PRESTAÇÃO DE SERVIÇO DE TRANSPORTE</h1>
            <p className="text-sm text-gray-500">Data: {format(new Date(freight.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          
          {user && (
            <div className="text-right mt-4 md:mt-0">
              {user.companyName && <p className="font-semibold">{user.companyName}</p>}
              {user.cnpj && <p>CNPJ: {user.cnpj}</p>}
              {user.address && <p>{user.address}</p>}
              <p>{user.city} - {user.state}</p>
              {user.phone && <p>Tel: {user.phone}</p>}
            </div>
          )}
        </div>

        {/* Seção de dados do cliente */}
        <div className="mb-4 border p-4 rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold border-b pb-2 mb-2">Informações do Cliente</h2>
          {client ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Nome/Razão Social:</strong> {client.name}</p>
              {client.cnpj && <p><strong>CNPJ:</strong> {client.cnpj}</p>}
              {client.address && <p><strong>Endereço:</strong> {client.address}</p>}
              <p><strong>Cidade/UF:</strong> {client.city} - {client.state}</p>
              {client.contactName && <p><strong>Contato:</strong> {client.contactName}</p>}
              {client.phone && <p><strong>Telefone:</strong> {client.phone}</p>}
            </div>
          ) : (
            <p>Cliente não encontrado.</p>
          )}
        </div>

        {/* Seção de detalhes do frete */}
        <div className="mb-4 border p-4 rounded-md">
          <h2 className="text-lg font-semibold border-b pb-2 mb-2">Detalhes do Frete</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p><strong>Origem:</strong> {freight.originCity} - {freight.originState}</p>
            <p><strong>Destino:</strong> {freight.destinationCity} - {freight.destinationState}</p>
            <p><strong>Tipo de Carga:</strong> {freight.cargoType}</p>
            {freight.cargoWeight && <p><strong>Peso da Carga:</strong> {freight.cargoWeight} kg</p>}
            {freight.cargoDescription && <p><strong>Descrição:</strong> {freight.cargoDescription}</p>}
            <p><strong>Data do Serviço:</strong> {format(new Date(freight.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
            <p className="font-semibold"><strong>Valor Total:</strong> {formatCurrency(freight.totalValue)}</p>
          </div>
        </div>

        {/* Seção do motorista, se disponível */}
        {driver && (
          <div className="mb-4 border p-4 rounded-md">
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">Informações do Motorista</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Nome:</strong> {driver.name}</p>
              <p><strong>CPF:</strong> {driver.cpf}</p>
              <p><strong>Placa do Veículo:</strong> {driver.licensePlate}</p>
              {driver.vehicleModel && <p><strong>Veículo:</strong> {driver.vehicleModel}</p>}
            </div>
          </div>
        )}

        {/* Seção de informações de pagamento */}
        <div className="mb-6 border p-4 rounded-md">
          <h2 className="text-lg font-semibold border-b pb-2 mb-2">Informações de Cobrança</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {freight.requesterName && <p><strong>Solicitante:</strong> {freight.requesterName}</p>}
            {freight.paymentTerm && <p><strong>Prazo de Pagamento:</strong> {freight.paymentTerm}</p>}
            {freight.pixKey && <p><strong>Chave PIX:</strong> {freight.pixKey}</p>}
          </div>
        </div>

        {/* Seção de declaração e assinatura */}
        <div className="mt-8 border-t pt-4">
          <p className="mb-4 text-sm">
            Recebi a quantia de <strong>{totalValueText}</strong> ({amountInWords} reais) referente à prestação 
            de serviço de transporte conforme detalhado acima.
          </p>
          
          {/* Assinatura */}
          <div className="mt-12 pt-6">
            <div className="border-t border-gray-400 w-64 mx-auto"></div>
            <p className="text-center mt-2">Assinatura do Recebedor</p>
            {user && (
              <p className="text-center text-sm mt-1">
                {user.name} 
                {user.cpf && <span> - CPF: {user.cpf}</span>}
              </p>
            )}
          </div>
          
          {/* Rodapé com informações da empresa */}
          <div className="mt-8 text-center text-xs text-gray-500">
            {user && (
              <>
                {user.companyName && <p>{user.companyName}</p>}
                {user.cnpj && <p>CNPJ: {user.cnpj}</p>}
                {user.phone && <p>Tel: {user.phone}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
