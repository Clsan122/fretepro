import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SimpleFreightReceiptGeneratorProps {
  freights: Freight[];
}

const SimpleFreightReceiptGenerator: React.FC<SimpleFreightReceiptGeneratorProps> = ({
  freights,
}) => {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const totalAmount = freights.reduce((sum, freight) => sum + freight.totalValue, 0);
  const requesterName = freights[0]?.requesterName || "";

  const formatDateToDDMMAAAA = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}${month}${year}`;
  };

  const getDateRangeText = () => {
    if (freights.length === 0) return "";
    if (freights.length === 1) {
      return `do serviço realizado no dia ${formatDateToDDMMAAAA(freights[0].departureDate)}`;
    }
    
    const dates = freights.map(f => new Date(f.departureDate)).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = formatDateToDDMMAAAA(dates[0].toISOString());
    const lastDate = formatDateToDDMMAAAA(dates[dates.length - 1].toISOString());
    
    if (firstDate === lastDate) {
      return `dos serviços realizados no dia ${firstDate}`;
    }
    return `dos serviços realizados no período de ${firstDate} a ${lastDate}`;
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Recibo_Simples_${formatDateToDDMMAAAA(new Date().toISOString())}`,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => handlePrint()} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>

      <div ref={printRef} className="bg-white">
        <style type="text/css">
          {`
            @media print {
              body { margin: 0; padding: 0; background: white !important; }
              * { box-sizing: border-box; }
              .print-container { 
                width: 210mm; 
                min-height: 297mm; 
                padding: 20mm;
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #000;
                background: white;
                page-break-inside: avoid;
              }
              .print-hidden { display: none !important; }
              .page-break { page-break-before: always; }
              .border-b { border-bottom: 1px solid #333; }
              .border-t { border-top: 1px solid #333; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .mb-4 { margin-bottom: 16px; }
              .mb-6 { margin-bottom: 24px; }
              .pb-4 { padding-bottom: 16px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .items-center { align-items: center; }
              .w-full { width: 100%; }
              .space-y-2 > * + * { margin-top: 8px; }
              .text-xl { font-size: 18px; }
              .text-lg { font-size: 16px; }
              .text-sm { font-size: 11px; }
              .text-xs { font-size: 10px; }
              .table { width: 100%; border-collapse: collapse; }
              .table th, .table td { 
                padding: 8px; 
                text-align: left; 
                border-bottom: 1px solid #ddd; 
              }
              .table th { font-weight: bold; background-color: #f8f9fa; }
              .signature-line { 
                border-top: 1px solid #333; 
                width: 200px; 
                margin-top: 40px; 
                text-align: center; 
                padding-top: 8px; 
              }
            }
          `}
        </style>

        <div className="print-container bg-white text-black">
          {/* Cabeçalho */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                {user?.companyLogo && (
                  <img 
                    src={user.companyLogo} 
                    alt="Logo da Empresa" 
                    className="w-[120px] h-[60px] object-contain mb-2" 
                  />
                )}
                <div className="space-y-1 text-sm">
                  <div className="font-bold text-lg">{user?.companyName || user?.name}</div>
                  {user?.address && <div>{user.address}</div>}
                  {user?.city && user?.state && <div>{user.city}/{user.state}</div>}
                  {user?.cnpj && <div>CNPJ: {user.cnpj}</div>}
                  {user?.phone && <div>Telefone: {user.phone}</div>}
                  {user?.email && <div>Email: {user.email}</div>}
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold mb-2">RECIBO DE FRETES</h1>
                <div className="text-sm">
                  <div>Data: {formatDateToDDMMAAAA(new Date().toISOString())}</div>
                  <div>Recibo Nº: {formatDateToDDMMAAAA(new Date().toISOString())}-{freights.length.toString().padStart(3, '0')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Recibo */}
          <div className="mb-6">
            <div className="text-sm space-y-2">
              <div>
                <strong>Recebi de:</strong> {requesterName || "Cliente"}
              </div>
              <div>
                <strong>A quantia de:</strong> {formatCurrency(totalAmount)} ({totalAmount.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).replace(/R\$\s?/, '')} reais)
              </div>
              <div>
                <strong>Referente a:</strong> Prestação de serviços de transporte {getDateRangeText()}
              </div>
            </div>
          </div>

          {/* Tabela de Serviços */}
          <div className="mb-6">
            <h3 className="font-bold mb-4 text-lg">DISCRIMINAÇÃO DOS SERVIÇOS</h3>
            <table className="table w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Data</th>
                  <th className="text-left">Origem</th>
                  <th className="text-left">Destino</th>
                  <th className="text-left">Motorista</th>
                  <th className="text-right">Valor do Frete</th>
                  <th className="text-right">Diária</th>
                  <th className="text-right">Outros Custos</th>
                  <th className="text-right">Pedágios</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {freights.map((freight, index) => (
                  <tr key={freight.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="text-xs">{formatDateToDDMMAAAA(freight.departureDate)}</td>
                    <td className="text-xs">{freight.originCity || "-"}</td>
                    <td className="text-xs">{freight.destinationCity || "-"}</td>
                    <td className="text-xs">{freight.driverName || "-"}</td>
                    <td className="text-right text-xs">{formatCurrency(freight.freightValue)}</td>
                    <td className="text-right text-xs">{formatCurrency(freight.dailyRate)}</td>
                    <td className="text-right text-xs">{formatCurrency(freight.otherCosts)}</td>
                    <td className="text-right text-xs">{formatCurrency(freight.tollCosts)}</td>
                    <td className="text-right text-xs font-bold">{formatCurrency(freight.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-t-2">
                  <td colSpan={8} className="text-right font-bold">TOTAL GERAL:</td>
                  <td className="text-right font-bold text-lg">{formatCurrency(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Rodapé */}
          <div className="mb-6">
            <div className="text-sm space-y-2">
              <div><strong>Forma de Pagamento:</strong> Conforme acordado</div>
              <div><strong>Observações:</strong> Recibo referente aos serviços de transporte prestados conforme discriminado acima.</div>
            </div>
          </div>

          {/* Informações do Recebedor */}
          <div className="mb-6 border-t pt-4">
            <div className="text-sm space-y-1">
              <div><strong>Recebedor:</strong> {user?.name}</div>
              {user?.cpf && <div><strong>CPF:</strong> {user.cpf}</div>}
              {user?.phone && <div><strong>Telefone:</strong> {user.phone}</div>}
            </div>
          </div>

          {/* Assinatura */}
          <div className="flex justify-end">
            <div className="text-center">
              <div className="signature-line">
                {user?.name}<br />
                <span className="text-xs">Prestador de Serviços</span>
              </div>
            </div>
          </div>

          {/* Rodapé da página */}
          <div className="text-center text-xs mt-8 pt-4 border-t">
            <div>{user?.city}/{user?.state} - {formatDateToDDMMAAAA(new Date().toISOString())}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFreightReceiptGenerator;