
import React from "react";
import { QuotationData } from "./types";
import { formatCurrency, formatCPFCNPJ, formatPhone } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FreightQuotationPdfProps {
  quotation: QuotationData;
  clientInfo?: {
    name: string;
    company?: string;
    city: string;
    state: string;
    document?: string;
    email?: string;
    phone?: string;
  };
  creatorInfo: {
    name: string;
    document?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  };
}

// Função auxiliar para traduzir o tipo de veículo
const getVehicleTypeInPortuguese = (vehicleType: string): string => {
  const vehicleTypes: Record<string, string> = {
    "van": "Van de Carga",
    "utility": "Utilitário Pequeno",
    "truck_small": "Caminhão 3/4",
    "truck_medium": "Caminhão Toco",
    "truck_large": "Caminhão Truck",
    "truck_extra": "Caminhão Bitruck",
    "trailer": "Carreta Simples",
    "trailer_extended": "Carreta Estendida",
    "trailer_refrigerated": "Carreta Refrigerada"
  };
  
  return vehicleTypes[vehicleType] || vehicleType;
};

// Função auxiliar para traduzir o tipo de carga
const getCargoTypeInPortuguese = (cargoType: string): string => {
  const cargoTypes: Record<string, string> = {
    "general": "Carga Geral",
    "fragile": "Carga Frágil",
    "perishable": "Perecíveis",
    "dangerous": "Carga Perigosa"
  };
  
  return cargoTypes[cargoType] || cargoType;
};

export const FreightQuotationPdf: React.FC<FreightQuotationPdfProps> = ({ 
  quotation, 
  clientInfo, 
  creatorInfo 
}) => {
  // Calcular a data de validade da proposta (7 dias a partir da emissão)
  const validUntil = new Date(quotation.createdAt);
  validUntil.setDate(validUntil.getDate() + 7);
  
  // Calcular prazo estimado de entrega (exemplo: 2 dias após a data de emissão)
  const estimatedDelivery = new Date(quotation.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 2); // Placeholder - idealmente seria um campo na cotação
  
  return (
    <div id="quotation-pdf" className="bg-white p-6 w-full max-w-4xl mx-auto font-sans text-gray-800 text-sm">
      {/* Cabeçalho com logo e informações da transportadora */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-4 border-b border-gray-300">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-freight-800 mb-1">Cotação de Frete</h1>
          <p className="text-sm text-freight-700">Nº {quotation.orderNumber}</p>
          <p className="text-sm text-freight-700">
            Data: {format(new Date(quotation.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex flex-col items-end mt-4 sm:mt-0">
          {quotation.creatorLogo && (
            <div className="w-32 mb-2">
              <img 
                src={quotation.creatorLogo} 
                alt="Logo da Transportadora" 
                className="max-h-16 object-contain" 
              />
            </div>
          )}
          <div className="text-right">
            <p className="font-semibold text-freight-800">{creatorInfo.name}</p>
            {creatorInfo.document && (
              <p className="text-sm text-freight-700">CNPJ: {formatCPFCNPJ(creatorInfo.document)}</p>
            )}
            {creatorInfo.phone && (
              <p className="text-sm text-freight-700">Tel: {formatPhone(creatorInfo.phone)}</p>
            )}
            {creatorInfo.email && (
              <p className="text-sm text-freight-700">E-mail: {creatorInfo.email}</p>
            )}
            {(creatorInfo.address && creatorInfo.city) && (
              <p className="text-sm text-freight-700">
                {creatorInfo.address}, {creatorInfo.city}/{creatorInfo.state}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Informações do cliente */}
      {clientInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Dados do Cliente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <p><span className="font-medium">Nome:</span> {clientInfo.name}</p>
              {clientInfo.company && (
                <p><span className="font-medium">Empresa:</span> {clientInfo.company}</p>
              )}
              <p>
                <span className="font-medium">Localidade:</span> {clientInfo.city}/{clientInfo.state}
              </p>
            </div>
            <div>
              {clientInfo.document && (
                <p><span className="font-medium">CNPJ/CPF:</span> {formatCPFCNPJ(clientInfo.document)}</p>
              )}
              {clientInfo.email && (
                <p><span className="font-medium">E-mail:</span> {clientInfo.email}</p>
              )}
              {clientInfo.phone && (
                <p><span className="font-medium">Telefone:</span> {formatPhone(clientInfo.phone)}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Informações de origem e destino */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Rota</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
          <div>
            <p className="font-medium text-freight-700">Origem</p>
            <p className="text-freight-800 text-lg">{quotation.originCity} / {quotation.originState}</p>
          </div>
          <div>
            <p className="font-medium text-freight-700">Destino</p>
            <p className="text-freight-800 text-lg">{quotation.destinationCity} / {quotation.destinationState}</p>
          </div>
        </div>
      </div>
      
      {/* Detalhes da carga */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Detalhes da Carga</h2>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-2 px-3 font-medium">Volumes:</td>
                <td className="py-2 px-3">{quotation.volumes}</td>
                <td className="py-2 px-3 font-medium">Peso:</td>
                <td className="py-2 px-3">{quotation.weight} kg</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium">Tipo de Carga:</td>
                <td className="py-2 px-3">{getCargoTypeInPortuguese(quotation.cargoType)}</td>
                <td className="py-2 px-3 font-medium">Veículo:</td>
                <td className="py-2 px-3">{getVehicleTypeInPortuguese(quotation.vehicleType) || "A definir"}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Valor da Mercadoria:</td>
                <td className="py-2 px-3" colSpan={3}>{formatCurrency(quotation.merchandiseValue)}</td>
              </tr>
              {quotation.measurements && quotation.measurements.length > 0 && (
                <tr className="border-t border-gray-200">
                  <td className="py-2 px-3 font-medium">Dimensões:</td>
                  <td className="py-2 px-3" colSpan={3}>
                    <div className="space-y-1">
                      {quotation.measurements.map((measurement, index) => (
                        <div key={measurement.id} className="text-sm">
                          {index + 1}. {measurement.length} x {measurement.width} x {measurement.height} cm
                          {measurement.quantity > 1 ? ` (${measurement.quantity} volumes)` : ''}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Prazo de entrega */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Prazo e Validade</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
          <div>
            <p className="font-medium text-freight-700">Prazo Estimado de Entrega</p>
            <p className="text-freight-800">
              {format(estimatedDelivery, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          <div>
            <p className="font-medium text-freight-700">Validade da Proposta</p>
            <p className="text-freight-800">
              {format(validUntil, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Composição do Frete */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Composição do Frete</h2>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium w-2/3">Valor do Frete:</td>
                <td className="py-2 px-3 text-right w-1/3">{formatCurrency(quotation.freightValue)}</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-2 px-3 font-medium">Pedágio:</td>
                <td className="py-2 px-3 text-right">{formatCurrency(quotation.tollValue)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium">
                  Seguro ({quotation.insuranceRate}%):
                </td>
                <td className="py-2 px-3 text-right">{formatCurrency(quotation.insuranceValue)}</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-2 px-3 font-medium">Outros Custos:</td>
                <td className="py-2 px-3 text-right">{formatCurrency(quotation.otherCosts)}</td>
              </tr>
              <tr className="bg-freight-700 text-white">
                <td className="py-3 px-3 font-bold text-base">VALOR TOTAL:</td>
                <td className="py-3 px-3 font-bold text-right text-base">{formatCurrency(quotation.totalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Forma de pagamento */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Forma de Pagamento</h2>
        <p className="p-3 bg-gray-50 rounded-md">
          À vista via PIX ou transferência bancária. Outras formas de pagamento podem ser negociadas.
        </p>
      </div>
      
      {/* Observações */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b pb-1">Observações</h2>
        <div className="p-3 bg-gray-50 rounded-md">
          <ul className="list-disc pl-5 space-y-1">
            <li>Este orçamento inclui seguro de carga conforme valor declarado da mercadoria.</li>
            <li>O prazo de entrega pode variar de acordo com condições climáticas e de tráfego.</li>
            {quotation.notes && (
              <li className="whitespace-pre-wrap">{quotation.notes}</li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Rodapé */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="mb-2 text-freight-700 font-medium">
          Agradecemos a preferência! Estamos à disposição para qualquer esclarecimento.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-freight-600">
          {creatorInfo.phone && (
            <p>Tel: {formatPhone(creatorInfo.phone)}</p>
          )}
          {creatorInfo.email && (
            <p>E-mail: {creatorInfo.email}</p>
          )}
          <p>FreteValor © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};
