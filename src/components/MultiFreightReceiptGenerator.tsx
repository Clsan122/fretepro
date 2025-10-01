import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getClientById } from "@/utils/storage";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({
  freights,
}) => {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  if (!freights || freights.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Nenhum frete encontrado para gerar o recibo.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Erro: usuário não autenticado.</p>
      </div>
    );
  }

  const totalAmount = freights.reduce((sum, freight) => sum + (freight.totalValue || 0), 0);

  const formatDateToDDMMAAAA = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
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
    documentTitle: `Recibo_Multiplos_Fretes_${formatDateToDDMMAAAA(new Date().toISOString()).replace(/\//g, '')}_${freights.length}`,
  });

  return (
    <div className="space-y-6">
      {/* Botão de ação */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={() => handlePrint()} 
          className="flex items-center gap-2 px-6 py-3"
          size="lg"
        >
          <Printer className="h-5 w-5" />
          Gerar PDF do Recibo
        </Button>
      </div>

      {/* Container do recibo */}
      <div ref={printRef} className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <style type="text/css">
          {`
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                background: white !important; 
                font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
              }
              * { box-sizing: border-box; }
              .print-container { 
                width: 210mm; 
                min-height: 297mm; 
                padding: 15mm;
                font-size: 11px;
                line-height: 1.6;
                color: #1f2937;
                background: white;
                page-break-inside: avoid;
              }
              .print-hidden { display: none !important; }
              .header-section { 
                background: white !important;
                border-bottom: 3px solid #0c96e6;
                padding: 20px 0;
                margin-bottom: 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              }
              .company-logo {
                max-width: 80px;
                max-height: 80px;
                object-fit: contain;
                margin-right: 20px;
              }
              .header-title {
                color: #0c96e6;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                letter-spacing: -0.5px;
              }
              .receipt-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 25px 0;
                border: 2px solid #e5e7eb;
              }
              .receipt-table th { 
                background: #f8fafc;
                color: #1f2937;
                padding: 12px 10px; 
                text-align: left; 
                font-weight: 600;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #0c96e6;
              }
              .receipt-table td { 
                padding: 10px; 
                border-bottom: 1px solid #e5e7eb;
                font-size: 10px;
                color: #374151;
              }
              .receipt-table tbody tr:nth-child(even) { 
                background: #fafafa; 
              }
              .total-section {
                background: #f8fafc;
                border: 2px solid #0c96e6;
                padding: 25px;
                text-align: center;
                margin: 30px 0;
              }
              .total-label {
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .total-value {
                font-size: 36px;
                font-weight: 700;
                color: #0c96e6;
                margin: 10px 0;
              }
              .info-box {
                border: 1px solid #e5e7eb;
                padding: 15px;
                margin: 20px 0;
                background: #fafafa;
              }
              .info-title {
                font-size: 12px;
                font-weight: 600;
                color: #0c96e6;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .signature-area {
                margin-top: 60px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
                text-align: center;
              }
              .signature-line { 
                border-top: 2px solid #1f2937; 
                width: 300px; 
                margin: 60px auto 0; 
                text-align: center; 
                padding-top: 8px; 
                font-weight: 600;
                font-size: 11px;
              }
            }
          `}
        </style>

        <div className="print-container bg-white text-gray-900">
          {/* Cabeçalho Clean */}
          <div className="header-section">
            <div className="flex items-start gap-6">
              {user?.companyLogo && (
                <img 
                  src={user.companyLogo} 
                  alt="Logo" 
                  className="company-logo" 
                />
              )}
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900 mb-2">{user?.companyName || user?.name}</div>
                <div className="space-y-1 text-xs text-gray-600">
                  {user?.address && <div>{user.address}</div>}
                  {user?.city && user?.state && <div>{user.city}/{user.state}</div>}
                  {user?.cnpj && <div>CNPJ: {user.cnpj}</div>}
                  {user?.phone && <div>Tel: {user.phone}</div>}
                  {user?.email && <div>{user.email}</div>}
                </div>
              </div>
            </div>
            <div className="text-right mt-4">
              <h1 className="header-title">RECIBO DE FRETES</h1>
              <div className="text-xs text-gray-600 mt-2">
                <div>Data: {formatDateToDDMMAAAA(new Date().toISOString())}</div>
                <div>Nº: {formatDateToDDMMAAAA(new Date().toISOString()).replace(/\//g, '')}-{freights.length.toString().padStart(3, '0')}</div>
              </div>
            </div>
          </div>

          {/* Informações do recibo */}
          <div className="info-box">
            <h3 className="info-title">Informações do Recibo</h3>
            <div className="space-y-2 text-xs">
              <div><strong>Valor:</strong> {formatCurrency(totalAmount)}</div>
              <div><strong>Referente a:</strong> Prestação de serviços de transporte {getDateRangeText()}</div>
              <div><strong>Quantidade:</strong> {freights.length} {freights.length === 1 ? 'frete' : 'fretes'}</div>
            </div>
          </div>

          {/* Tabela de serviços */}
          <div className="mb-6">
            <h3 className="info-title mb-3">Discriminação dos Serviços</h3>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Origem → Destino</th>
                  <th>Solicitante</th>
                  <th className="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {freights.map((freight) => {
                  const client = getClientById(freight.clientId);
                  return (
                    <tr key={freight.id}>
                      <td className="text-center">{formatDateToDDMMAAAA(freight.departureDate)}</td>
                      <td>{client?.name || "Cliente não identificado"}</td>
                      <td>
                        {freight.originCity || "N/A"} → {freight.destinationCity || "N/A"}
                      </td>
                      <td>{freight.requesterName || "Não informado"}</td>
                      <td className="text-right font-semibold">
                        {formatCurrency(freight.totalValue || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Valor Total */}
          <div className="total-section">
            <div className="total-label">Valor Total</div>
            <div className="total-value">{formatCurrency(totalAmount)}</div>
            <div className="text-xs text-gray-600 mt-2">
              {freights.length} {freights.length === 1 ? 'frete processado' : 'fretes processados'}
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="info-box">
            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
              <div><strong>Forma de Pagamento:</strong> Conforme acordado</div>
              <div><strong>Vencimento:</strong> Conforme contrato</div>
            </div>
            <div className="text-xs">
              <strong>Observações:</strong> Recibo referente aos serviços de transporte prestados conforme discriminado acima.
            </div>
          </div>

          {/* Seção de assinatura */}
          <div className="signature-area">
            <div className="text-xs space-y-1 mb-6 text-gray-700">
              <div className="font-semibold">Prestador de Serviços:</div>
              <div>{user?.name}</div>
              {user?.cpf && <div>CPF: {user.cpf}</div>}
              {user?.phone && <div>Contato: {user.phone}</div>}
            </div>

            <div className="signature-line">
              {user?.name}
              <div className="text-xs font-normal text-gray-600 mt-1">Prestador de Serviços</div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-xs mt-8 pt-4 border-t border-gray-300 text-gray-600">
            <div>{user?.city && user?.state ? `${user.city}/${user.state}` : ''} - {formatDateToDDMMAAAA(new Date().toISOString())}</div>
            <div className="mt-1">Documento gerado eletronicamente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;