
import React from "react";
import { QuotationFormData } from "@/hooks/useQuotationForm";
import { Client } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface QuotationPdfContentProps {
  quotation: QuotationFormData;
  client?: Client | null;
}

const QuotationPdfContent: React.FC<QuotationPdfContentProps> = ({
  quotation,
  client
}) => {
  const createdAt = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="bg-white p-6 print:p-0">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          {quotation.logo && (
            <img 
              src={quotation.logo}
              alt="Logo"
              className="max-h-16 max-w-[200px] mb-2"
            />
          )}
          <h1 className="text-xl md:text-2xl font-bold mb-1">Cotação de Frete</h1>
          <p className="text-sm text-muted-foreground">Gerada em {createdAt}</p>
        </div>
      </div>
      
      {/* Informações do Cliente */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Cliente</h2>
        <p><strong>Nome:</strong> {client?.name || "Cliente não informado"}</p>
      </div>
      
      {/* Remetente e Destinatário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Remetente</h2>
          <p><strong>Nome:</strong> {quotation.sender}</p>
          <p><strong>Endereço:</strong> {quotation.senderAddress}</p>
          <p><strong>Cidade/UF:</strong> {quotation.senderCity}/{quotation.senderState}</p>
          {quotation.senderCnpj && <p><strong>CNPJ:</strong> {quotation.senderCnpj}</p>}
        </div>
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Destinatário</h2>
          <p><strong>Nome:</strong> {quotation.recipient}</p>
          <p><strong>Endereço:</strong> {quotation.recipientAddress}</p>
        </div>
      </div>
      
      {/* Localização */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Localização</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Origem:</strong> {quotation.originCity}/{quotation.originState}</p>
          <p><strong>Destino:</strong> {quotation.destinationCity}/{quotation.destinationState}</p>
        </div>
      </div>
      
      {/* Informações da Carga */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Informações da Carga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Volumes:</strong> {quotation.volumes}</p>
            <p><strong>Peso:</strong> {quotation.weight} kg</p>
            <p><strong>Dimensões:</strong> {quotation.length}x{quotation.width}x{quotation.height} m</p>
            <p><strong>Cubagem:</strong> {(quotation.length * quotation.width * quotation.height) / 1000000} m³</p>
          </div>
          <div>
            <p><strong>Valor da Mercadoria:</strong> {formatCurrency(quotation.merchandiseValue)}</p>
            <p><strong>Tipo de Veículo:</strong> {quotation.vehicleType || "Não especificado"}</p>
            {quotation.observations && (
              <p className="mt-2"><strong>Observações:</strong> {quotation.observations}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Valores */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2">Valores</h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1 font-medium">Valor do Frete:</td>
              <td className="py-1 text-right">{formatCurrency(quotation.quotedValue)}</td>
            </tr>
            <tr>
              <td className="py-1 font-medium">Pedágio:</td>
              <td className="py-1 text-right">{formatCurrency(quotation.toll)}</td>
            </tr>
            <tr>
              <td className="py-1 font-medium">Seguro ({quotation.insurancePercentage}%):</td>
              <td className="py-1 text-right">{formatCurrency(quotation.insurance)}</td>
            </tr>
            <tr>
              <td className="py-1 font-medium">Outros:</td>
              <td className="py-1 text-right">{formatCurrency(quotation.others)}</td>
            </tr>
            <tr className="font-bold">
              <td className="pt-2 border-t">Valor Total:</td>
              <td className="pt-2 border-t text-right">{formatCurrency(quotation.totalValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Rodapé */}
      <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
        <p>Esta cotação é válida por 5 dias úteis a partir da data de emissão.</p>
        <p className="mt-1">FreteValor - Gerenciamento de Fretes</p>
      </div>
    </div>
  );
};

export default QuotationPdfContent;
