
import React from "react";
import { QuotationData } from "./types";
import { formatCurrency, formatCNPJ as formatCPFCNPJ, formatPhone } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Logo from "@/components/Logo";

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
    <div id="quotation-pdf" className="bg-white p-4 w-full max-w-4xl mx-auto font-sans text-gray-800 text-xs shadow-lg rounded-lg border border-gray-200 print:shadow-none print:border-none">
      {/* Cabeçalho com borda e gradiente */}
      <div className="bg-gradient-to-r from-freight-50 to-freight-100 p-4 rounded-lg shadow-sm mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-freight-700"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-freight-800 mb-0">Cotação de Frete</h1>
            <p className="text-freight-700 font-medium text-xs">
              N° <span className="text-freight-800">{quotation.orderNumber}</span>
            </p>
            <p className="text-freight-700 text-xs mt-0">
              <span className="font-medium">Emissão:</span> {format(new Date(quotation.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          
          <div className="flex flex-col items-end mt-2 sm:mt-0">
            <div className="mb-2">
              {quotation.creatorLogo ? (
                <img 
                  src={quotation.creatorLogo} 
                  alt="Logo da Transportadora" 
                  className="w-[120px] h-[70px] object-contain" 
                />
              ) : (
                <Logo variant="full" size="md" className="text-freight-700" />
              )}
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold text-freight-800">{creatorInfo.name}</p>
              {creatorInfo.document && (
                <p className="text-xs text-freight-700">CNPJ: {formatCPFCNPJ(creatorInfo.document)}</p>
              )}
              {creatorInfo.phone && (
                <p className="text-xs text-freight-700">Tel: {formatPhone(creatorInfo.phone)}</p>
              )}
              {creatorInfo.email && (
                <p className="text-xs text-freight-700">E-mail: {creatorInfo.email}</p>
              )}
              {(creatorInfo.address && creatorInfo.city) && (
                <p className="text-xs text-freight-700">
                  {creatorInfo.address}, {creatorInfo.city}/{creatorInfo.state}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Informações do cliente com estilo de cartão */}
      {clientInfo && (
        <div className="mb-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold mb-2 text-freight-800 border-b border-freight-100 pb-1">
            Dados do Cliente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
            <div>
              <p className="flex items-baseline mb-1">
                <span className="font-medium text-freight-800 w-16">Nome:</span> 
                <span className="text-freight-700">{clientInfo.name}</span>
              </p>
              {clientInfo.company && (
                <p className="flex items-baseline mb-1">
                  <span className="font-medium text-freight-800 w-16">Empresa:</span> 
                  <span className="text-freight-700">{clientInfo.company}</span>
                </p>
              )}
              <p className="flex items-baseline mb-1">
                <span className="font-medium text-freight-800 w-16">Localidade:</span> 
                <span className="text-freight-700">{clientInfo.city}/{clientInfo.state}</span>
              </p>
            </div>
            <div>
              {clientInfo.document && (
                <p className="flex items-baseline mb-1">
                  <span className="font-medium text-freight-800 w-16">CNPJ/CPF:</span> 
                  <span className="text-freight-700">{formatCPFCNPJ(clientInfo.document)}</span>
                </p>
              )}
              {clientInfo.email && (
                <p className="flex items-baseline mb-1">
                  <span className="font-medium text-freight-800 w-16">E-mail:</span> 
                  <span className="text-freight-700">{clientInfo.email}</span>
                </p>
              )}
              {clientInfo.phone && (
                <p className="flex items-baseline mb-1">
                  <span className="font-medium text-freight-800 w-16">Telefone:</span> 
                  <span className="text-freight-700">{formatPhone(clientInfo.phone)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Informações de origem e destino */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Rota</h2>
        <div className="flex flex-col sm:flex-row bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex-1 p-2 bg-gradient-to-br from-freight-50 to-freight-100">
            <p className="font-medium text-freight-700 mb-0 text-xs">Origem</p>
            <p className="text-freight-800 text-sm font-semibold">{quotation.originCity}</p>
            <p className="text-freight-700 text-xs">{quotation.originState}</p>
          </div>
          <div className="w-6 flex items-center justify-center bg-freight-50 py-1">
            <div className="w-4 h-4 text-freight-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          <div className="flex-1 p-2 bg-gradient-to-br from-freight-50 to-freight-100">
            <p className="font-medium text-freight-700 mb-0 text-xs">Destino</p>
            <p className="text-freight-800 text-sm font-semibold">{quotation.destinationCity}</p>
            <p className="text-freight-700 text-xs">{quotation.destinationState}</p>
          </div>
        </div>
      </div>
      
      {/* Detalhes da carga */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Detalhes da Carga</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-gray-200 bg-freight-50">
                <td className="py-1 px-2 font-medium text-freight-800">Volumes:</td>
                <td className="py-1 px-2 text-freight-700">{quotation.volumes}</td>
                <td className="py-1 px-2 font-medium text-freight-800">Peso:</td>
                <td className="py-1 px-2 text-freight-700">{quotation.weight} kg</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2 font-medium text-freight-800">Tipo de Carga:</td>
                <td className="py-1 px-2 text-freight-700">{getCargoTypeInPortuguese(quotation.cargoType)}</td>
                <td className="py-1 px-2 font-medium text-freight-800">Veículo:</td>
                <td className="py-1 px-2 text-freight-700">{getVehicleTypeInPortuguese(quotation.vehicleType) || "A definir"}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 font-medium text-freight-800">Valor da Mercadoria:</td>
                <td className="py-1 px-2 text-freight-700" colSpan={3}>{formatCurrency(quotation.merchandiseValue)}</td>
              </tr>
              {quotation.measurements && quotation.measurements.length > 0 && (
                <tr className="border-t border-gray-200 bg-freight-50">
                  <td className="py-1 px-2 font-medium text-freight-800">Dimensões:</td>
                  <td className="py-1 px-2" colSpan={3}>
                    <div className="flex flex-wrap gap-1">
                      {quotation.measurements.map((measurement, index) => (
                        <div key={measurement.id} className="text-freight-700 py-0 px-1 rounded-md bg-white border border-gray-100 text-xs">
                          <span className="font-medium text-freight-800">{index + 1}.</span> {measurement.length}x{measurement.width}x{measurement.height}cm
                          {measurement.quantity > 1 ? ` (${measurement.quantity}x)` : ''}
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
      <div className="mb-3">
        <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Prazo e Validade</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <p className="font-medium text-freight-700 mb-0 text-center">Prazo Estimado de Entrega</p>
            <p className="text-freight-800 text-sm font-semibold text-center">
              {format(estimatedDelivery, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <p className="font-medium text-freight-700 mb-0 text-center">Validade da Proposta</p>
            <p className="text-freight-800 text-sm font-semibold text-center">
              {format(validUntil, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Composição do Frete */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Composição do Frete</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-freight-50 transition-colors">
                <td className="py-1 px-2 font-medium text-freight-800 w-2/3">Valor do Frete:</td>
                <td className="py-1 px-2 text-right text-freight-700 w-1/3 font-medium">{formatCurrency(quotation.freightValue)}</td>
              </tr>
              <tr className="border-b border-gray-200 bg-freight-50 hover:bg-freight-100 transition-colors">
                <td className="py-1 px-2 font-medium text-freight-800">Pedágio:</td>
                <td className="py-1 px-2 text-right text-freight-700 font-medium">{formatCurrency(quotation.tollValue)}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-freight-50 transition-colors">
                <td className="py-1 px-2 font-medium text-freight-800">
                  Seguro ({quotation.insuranceRate}%):
                </td>
                <td className="py-1 px-2 text-right text-freight-700 font-medium">{formatCurrency(quotation.insuranceValue)}</td>
              </tr>
              <tr className="border-b border-gray-200 bg-freight-50 hover:bg-freight-100 transition-colors">
                <td className="py-1 px-2 font-medium text-freight-800">Outros Custos:</td>
                <td className="py-1 px-2 text-right text-freight-700 font-medium">{formatCurrency(quotation.otherCosts)}</td>
              </tr>
              <tr className="bg-freight-700 text-white">
                <td className="py-1 px-2 font-bold text-sm">VALOR TOTAL:</td>
                <td className="py-1 px-2 font-bold text-right text-sm">{formatCurrency(quotation.totalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Forma de pagamento e Observações em uma linha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div>
          <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Forma de Pagamento</h2>
          <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-xs h-[90%]">
            <p className="text-freight-700">
              À vista via PIX ou transferência bancária. Outras formas de pagamento podem ser negociadas.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Observações</h2>
          <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm h-[90%]">
            <ul className="list-disc pl-4 space-y-0 text-freight-700 text-xs">
              <li>Este orçamento inclui seguro de carga conforme valor declarado da mercadoria.</li>
              <li>O prazo de entrega pode variar de acordo com condições climáticas e de tráfego.</li>
              {quotation.notes && (
                <li className="whitespace-pre-wrap">{quotation.notes}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Rodapé */}
      <div className="mt-3 pt-2 border-t border-freight-200 text-center relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-freight-50 via-freight-200 to-freight-50"></div>
        <p className="mb-1 text-freight-800 font-medium text-xs">
          Agradecemos a preferência! Estamos à disposição para qualquer esclarecimento.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-freight-700">
          {creatorInfo.phone && (
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              {formatPhone(creatorInfo.phone)}
            </p>
          )}
          {creatorInfo.email && (
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              {creatorInfo.email}
            </p>
          )}
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            FreteValor © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

