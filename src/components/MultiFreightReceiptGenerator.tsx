
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight, Client } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getClientById, getUser } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();

  const handlePrint = useReactToPrint({
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    contentRef: componentRef,
  });

  const getTotalAmount = () => {
    return freights.reduce((sum, freight) => sum + freight.totalValue, 0);
  };

  // Group freights by client for better organization
  const freightsByClient = freights.reduce((acc, freight) => {
    const client = getClientById(freight.clientId);
    if (!client) return acc;
    
    if (!acc[client.id]) {
      acc[client.id] = {
        client,
        freights: []
      };
    }
    
    acc[client.id].freights.push(freight);
    return acc;
  }, {} as Record<string, { client: Client; freights: Freight[] }>);

  // Get the date range for the receipt title
  const getDateRangeText = () => {
    if (freights.length === 0) return "";
    
    const dates = freights.map(f => new Date(f.createdAt));
    const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // If same day
    if (earliestDate.toDateString() === latestDate.toDateString()) {
      return format(earliestDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    
    // If same month and year
    if (
      earliestDate.getMonth() === latestDate.getMonth() &&
      earliestDate.getFullYear() === latestDate.getFullYear()
    ) {
      return `${earliestDate.getDate()} a ${format(latestDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
    }
    
    // Different months
    return `${format(earliestDate, "d 'de' MMMM", { locale: ptBR })} a ${format(latestDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={() => handlePrint()}
          variant="outline" 
          className="gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          Imprimir Recibo
        </Button>
      </div>
      
      <div ref={componentRef} className="bg-white p-4 mx-auto max-w-4xl shadow-sm print:shadow-none print:p-0">
        {/* Print styles will be applied only when printing */}
        <style type="text/css" media="print">
          {`
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            th, td {
              padding: 3px !important;
              font-size: 10px !important;
            }
            h1, h2 {
              margin-bottom: 5px !important;
              font-size: 16px !important;
            }
            .print-compact {
              margin-bottom: 5px !important;
            }
            .print-table {
              font-size: 9px !important;
            }
            .print-hidden {
              display: none !important;
            }
            .print-small-text {
              font-size: 8px !important;
              line-height: 1.2 !important;
            }
            .print-tight {
              padding-top: 2px !important;
              padding-bottom: 2px !important;
            }
            .scale-down {
              transform: scale(0.95);
              transform-origin: top left;
            }
          `}
        </style>
        
        {/* Cabeçalho do recibo com dados da empresa */}
        <div className="flex flex-col sm:flex-row justify-between mb-2 print-compact">
          <div>
            <h1 className="text-xl font-bold">RECIBO DE FRETE</h1>
            <p className="text-gray-500 text-xs">Período: {getDateRangeText()}</p>
          </div>
          
          {currentUser && (
            <div className="text-right text-xs print-small-text">
              {currentUser.companyName && <p className="font-semibold">{currentUser.companyName}</p>}
              {currentUser.cnpj && <p>CNPJ: {currentUser.cnpj}</p>}
              {currentUser.phone && <p>Tel: {currentUser.phone}</p>}
              {currentUser.address && <p>{currentUser.address}</p>}
              {currentUser.city && currentUser.state && <p>{currentUser.city} - {currentUser.state}</p>}
            </div>
          )}
        </div>
        
        <div className="scale-down print-compact">
          <h2 className="text-base font-semibold mb-1">RESUMO DE FRETES</h2>
          
          <table className="w-full border-collapse print-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1 text-left">Nº</th>
                <th className="border p-1 text-left">Data</th>
                <th className="border p-1 text-left">Cliente</th>
                <th className="border p-1 text-left">Origem-Destino</th>
                <th className="border p-1 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {freights.map((freight, index) => {
                const client = getClientById(freight.clientId);
                return (
                  <tr key={freight.id} className="print-tight">
                    <td className="border p-1">{index + 1}</td>
                    <td className="border p-1">
                      {format(new Date(freight.createdAt), "dd/MM/yyyy")}
                    </td>
                    <td className="border p-1">{client?.name || "Cliente não encontrado"}</td>
                    <td className="border p-1">
                      {freight.originCity}/{freight.originState} - {freight.destinationCity}/{freight.destinationState}
                    </td>
                    <td className="border p-1 text-right">
                      {freight.totalValue.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-bold">
                <td colSpan={4} className="border p-1 text-right">Total:</td>
                <td className="border p-1 text-right">R$ {getTotalAmount().toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Detailed section by client - compacted for print */}
        <div className="scale-down">
          {Object.values(freightsByClient).map(({ client, freights }) => (
            <div key={client.id} className="mb-2 print-compact">
              <h2 className="text-sm font-semibold mb-1">Cliente: {client.name}</h2>
              {client.cnpj && <p className="text-xs mb-1">CNPJ: {client.cnpj}</p>}
              {client.address && <p className="text-xs mb-1 print-small-text">Endereço: {client.address} - {client.city}/{client.state}</p>}
              
              <table className="w-full border-collapse mb-1 print-table">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-1 text-left">Data</th>
                    <th className="border p-1 text-left">Origem-Destino</th>
                    <th className="border p-1 text-left">Carga</th>
                    <th className="border p-1 text-right">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {freights.map((freight) => (
                    <tr key={freight.id} className="print-tight">
                      <td className="border p-1">
                        {format(new Date(freight.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td className="border p-1">
                        {freight.originCity}/{freight.originState} - {freight.destinationCity}/{freight.destinationState}
                      </td>
                      <td className="border p-1">
                        {freight.cargoType === "general" && "Carga Geral"}
                        {freight.cargoType === "dangerous" && "Carga Perigosa"}
                        {freight.cargoType === "liquid" && "Líquido"}
                        {freight.cargoType === "sackCargo" && "Sacaria"}
                        {freight.cargoType === "drum" && "Tambores"}
                        {freight.cargoType === "pallet" && "Paletizada"}
                      </td>
                      <td className="border p-1 text-right">
                        {freight.totalValue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-1 text-right">Subtotal:</td>
                    <td className="border p-1 text-right">
                      R$ {freights.reduce((sum, f) => sum + f.totalValue, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
        
        <div className="mt-3 print-compact scale-down">
          <h2 className="text-base font-semibold mb-1">RECIBO</h2>
          <p className="mb-2 text-sm">
            Recebi a importância de <strong>R$ {getTotalAmount().toFixed(2)}</strong> ({getTotalAmount().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()} reais) referente aos fretes acima listados.
          </p>
          
          {/* Dados de pagamento */}
          {currentUser && (currentUser.pixKey || currentUser.bankInfo) && (
            <div className="mb-2 border-t border-b border-gray-200 py-2 text-xs print-small-text">
              <h3 className="font-semibold">Dados para Pagamento:</h3>
              {currentUser.pixKey && <p>PIX: {currentUser.pixKey}</p>}
              {currentUser.bankInfo && <p>Banco: {currentUser.bankInfo}</p>}
            </div>
          )}
          
          <div className="mt-4 pt-2 border-t border-gray-300 text-center">
            <p>_______________________________________________________</p>
            <p className="mt-1 text-sm">{currentUser?.name || "Assinatura"}</p>
            {currentUser?.cpf && <p className="text-xs">CPF: {currentUser.cpf}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;
