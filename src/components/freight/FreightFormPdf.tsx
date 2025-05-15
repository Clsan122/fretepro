
import React from "react";
import { Freight, Client, Driver, User } from "@/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";

interface FreightFormPdfProps {
  freight: Freight;
  client: Client | null;
  driver: Driver | null;
  sender: User | null;
}

const FreightFormPdf: React.FC<FreightFormPdfProps> = ({
  freight,
  client,
  driver,
  sender
}) => {
  return (
    <div id="freight-form-print" className="bg-white p-2 max-w-4xl mx-auto font-sans text-gray-800 print:p-1 print:text-black">
      <style type="text/css" media="print">
        {`
          @page {
            size: A4;
            margin: 5mm;
            scale: 0.90;
          }
          body {
            font-size: 8px !important;
            line-height: 1.1 !important;
          }
          img {
            max-height: 25px !important;
          }
          .border-b {
            border-bottom-width: 1px !important;
          }
          p {
            margin: 0 !important;
            line-height: 1.1 !important;
            margin-bottom: 1px !important;
          }
        `}
      </style>
      
      {/* Cabeçalho com informações do emissor e data */}
      <div className="flex justify-between items-start mb-1 border-b pb-1 print:mb-1 print:pb-0 print:border-gray-300">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-freight-700 print:text-black">Formulário de Frete</h1>
          <p className="text-xs text-gray-600 print:text-gray-800">Data: {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
        
        <div className="flex flex-col items-end">
          {sender?.companyLogo && (
            <img 
              src={sender.companyLogo} 
              alt="Logo da Empresa" 
              className="h-8 w-auto object-contain mb-0" 
            />
          )}
          <p className="font-semibold text-xs">{sender?.companyName || sender?.name || ""}</p>
          {sender?.cnpj && <p className="text-xs text-gray-600 print:text-gray-800">CNPJ: {sender.cnpj}</p>}
        </div>
      </div>

      {/* Informações do contratante e prestador */}
      <div className="grid grid-cols-2 gap-1 mb-1 print:mb-1 print:gap-1">
        <div className="border p-1 rounded-sm bg-gray-50 print:p-1 print:bg-white print:border-gray-300">
          <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:text-black print:border-gray-300">Transportadora Contratante</h2>
          <p className="text-xs"><span className="font-medium">Nome:</span> {client?.name || "N/A"}</p>
          {client?.cnpj && <p className="text-xs"><span className="font-medium">CNPJ:</span> {client.cnpj}</p>}
          {client?.address && <p className="text-xs"><span className="font-medium">End:</span> {client.address}</p>}
          {(client?.city && client?.state) && 
            <p className="text-xs"><span className="font-medium">Cidade/UF:</span> {client.city}/{client.state}</p>
          }
        </div>
        
        <div className="border p-1 rounded-sm bg-gray-50 print:p-1 print:bg-white print:border-gray-300">
          <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:text-black print:border-gray-300">Prestador de Serviço</h2>
          <p className="text-xs"><span className="font-medium">Nome:</span> {sender?.companyName || sender?.name || "N/A"}</p>
          {sender?.cnpj && <p className="text-xs"><span className="font-medium">CNPJ:</span> {sender.cnpj}</p>}
          {sender?.address && <p className="text-xs"><span className="font-medium">End:</span> {sender.address}</p>}
          {(sender?.city && sender?.state) && 
            <p className="text-xs"><span className="font-medium">Cidade/UF:</span> {sender.city}/{sender.state}</p>
          }
        </div>
      </div>

      {/* Informações da rota */}
      <div className="border p-1 rounded-sm mb-1 print:mb-1 print:p-1 print:border-gray-300">
        <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:mb-0 print:text-black print:border-gray-300">Rota</h2>
        <div className="grid grid-cols-2 gap-1 print:gap-1">
          <div>
            <p className="text-xs"><span className="font-medium">Origem:</span> {freight.originCity}/{freight.originState}</p>
            {freight.departureDate && (
              <p className="text-xs">
                <span className="font-medium">Data de Saída:</span> {format(parseISO(freight.departureDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs"><span className="font-medium">Destino:</span> {freight.destinationCity}/{freight.destinationState}</p>
            {freight.arrivalDate && (
              <p className="text-xs">
                <span className="font-medium">Data de Chegada:</span> {format(parseISO(freight.arrivalDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Informações do motorista */}
      {driver && (
        <div className="border p-1 rounded-sm mb-1 print:mb-1 print:p-1 print:border-gray-300">
          <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:mb-0 print:text-black print:border-gray-300">Motorista</h2>
          <div className="grid grid-cols-3 gap-1 print:gap-0">
            <div>
              <p className="text-xs"><span className="font-medium">Nome:</span> {driver.name}</p>
            </div>
            <div>
              <p className="text-xs"><span className="font-medium">CPF:</span> {driver.cpf}</p>
            </div>
            <div>
              <p className="text-xs"><span className="font-medium">Placa:</span> {driver.licensePlate}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 print:gap-0">
            <div>
              <p className="text-xs"><span className="font-medium">Tipo:</span> {driver.vehicleType}</p>
            </div>
            <div>
              <p className="text-xs"><span className="font-medium">Carroceria:</span> {driver.bodyType}</p>
            </div>
          </div>
        </div>
      )}

      {/* Informações da carga */}
      <div className="border p-1 rounded-sm mb-1 print:mb-1 print:p-1 print:border-gray-300">
        <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:mb-0 print:text-black print:border-gray-300">Detalhes da Carga</h2>
        <div className="grid grid-cols-4 gap-1 print:gap-0">
          <div>
            <p className="text-xs"><span className="font-medium">Volumes:</span> {freight.volumes}</p>
          </div>
          <div>
            <p className="text-xs"><span className="font-medium">Peso:</span> {freight.weight} kg</p>
          </div>
          <div>
            <p className="text-xs"><span className="font-medium">Cubagem:</span> {freight.cubicMeasurement || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs">
              <span className="font-medium">Tipo:</span> {freight.cargoType === "general" ? "Geral" : 
                                                      freight.cargoType === "fragile" ? "Frágil" :
                                                      freight.cargoType === "dangerous" ? "Perigosa" :
                                                      freight.cargoType === "refrigerated" ? "Refrigerada" :
                                                      freight.cargoType}
            </p>
          </div>
        </div>
        {freight.dimensions && (
          <div>
            <p className="text-xs"><span className="font-medium">Dimensões:</span> {freight.dimensions}</p>
          </div>
        )}
      </div>

      {/* Informações de pagamento */}
      {freight.paymentTerm && (
        <div className="border p-1 rounded-sm mb-1 print:mb-1 print:p-1 print:border-gray-300">
          <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:mb-0 print:text-black print:border-gray-300">Informações de Pagamento</h2>
          <div className="grid grid-cols-2 gap-1 print:gap-0">
            {freight.pixKey && (
              <div>
                <p className="text-xs"><span className="font-medium">Chave PIX:</span> {freight.pixKey}</p>
              </div>
            )}
            <div>
              <p className="text-xs"><span className="font-medium">Condição de Pagamento:</span> {freight.paymentTerm}</p>
            </div>
          </div>
          {freight.requesterName && (
            <div>
              <p className="text-xs"><span className="font-medium">Solicitante:</span> {freight.requesterName}</p>
            </div>
          )}
        </div>
      )}

      {/* Valores */}
      <div className="border p-1 rounded-sm mb-1 print:mb-1 print:p-1 print:border-gray-300">
        <h2 className="font-semibold text-xs text-freight-700 border-b pb-0 mb-0 print:mb-0 print:text-black print:border-gray-300">Valores</h2>
        <div className="grid grid-cols-2 gap-1 print:gap-0">
          <div>
            <p className="text-xs"><span className="font-medium">Valor do Frete:</span> {formatCurrency(freight.freightValue)}</p>
            {freight.dailyRate > 0 && (
              <p className="text-xs"><span className="font-medium">Diárias:</span> {formatCurrency(freight.dailyRate)}</p>
            )}
            {freight.tollCosts > 0 && (
              <p className="text-xs"><span className="font-medium">Pedágios:</span> {formatCurrency(freight.tollCosts)}</p>
            )}
            {freight.otherCosts > 0 && (
              <p className="text-xs"><span className="font-medium">Outros Custos:</span> {formatCurrency(freight.otherCosts)}</p>
            )}
          </div>
          <div className="bg-freight-50 p-1 rounded-sm print:p-0 print:bg-white print:border print:border-gray-300">
            <p className="font-bold text-freight-700 print:text-black text-xs">Valor Total: {formatCurrency(freight.totalValue)}</p>
          </div>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="mt-2 pt-1 grid grid-cols-2 gap-4 print:mt-2 print:gap-2">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1 print:border-gray-500">
            <p className="font-medium text-xs">Contratante</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1 print:border-gray-500">
            <p className="font-medium text-xs">Prestador de Serviço</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightFormPdf;
