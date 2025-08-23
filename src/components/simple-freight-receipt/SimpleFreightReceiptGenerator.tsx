import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getClientById } from "@/utils/storage";

interface SimpleFreightReceiptGeneratorProps {
  freights: Freight[];
}

const SimpleFreightReceiptGenerator: React.FC<SimpleFreightReceiptGeneratorProps> = ({
  freights,
}) => {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const totalAmount = freights.reduce((sum, freight) => sum + (freight.totalValue || 0), 0);
  
  // Verificar se todos os fretes são do mesmo cliente
  const uniqueClientIds = [...new Set(freights.map(f => f.clientId))];
  const isSingleClient = uniqueClientIds.length === 1;
  const firstClient = freights[0] ? getClientById(freights[0].clientId) : null;

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
    documentTitle: `Recibo_Fretes_${formatDateToDDMMAAAA(new Date().toISOString()).replace(/\//g, '')}_${freights.length}`,
  });

  return (
    <div className="space-y-6">
      {/* Botão de ação com design moderno */}
      <div className="flex gap-3">
        <Button 
          onClick={() => handlePrint()} 
          className="bg-freight-600 hover:bg-freight-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          size="lg"
        >
          <Printer className="h-5 w-5 mr-2" />
          Gerar PDF do Recibo
        </Button>
      </div>

      {/* Container do recibo com design moderno */}
      <div ref={printRef} className="bg-white shadow-2xl rounded-lg overflow-hidden">
        <style type="text/css">
          {`
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                background: white !important; 
                font-family: 'Arial', sans-serif;
              }
              * { box-sizing: border-box; }
              .print-container { 
                width: 210mm; 
                min-height: 297mm; 
                padding: 15mm;
                font-size: 11px;
                line-height: 1.4;
                color: #000;
                background: white;
                page-break-inside: avoid;
              }
              .print-hidden { display: none !important; }
              .header-gradient { 
                background: linear-gradient(135deg, #0c96e6 0%, #ff6b35 100%) !important; 
                color: white !important;
              }
              .info-card { 
                border: 2px solid #e5e7eb; 
                border-radius: 8px; 
                padding: 12px; 
                margin-bottom: 16px;
                background: #f9fafb;
              }
              .service-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 16px 0;
                border: 2px solid #0c96e6;
                border-radius: 8px;
                overflow: hidden;
              }
              .service-table th { 
                background: linear-gradient(135deg, #0c96e6 0%, #ff6b35 100%);
                color: white;
                padding: 12px 8px; 
                text-align: left; 
                font-weight: bold;
                font-size: 10px;
              }
              .service-table td { 
                padding: 10px 8px; 
                border-bottom: 1px solid #e5e7eb;
                font-size: 10px;
              }
              .service-table tbody tr:nth-child(even) { 
                background: #f8fafc; 
              }
              .service-table tfoot tr { 
                background: linear-gradient(135deg, #0c96e6 0%, #ff6b35 100%);
                color: white;
                font-weight: bold;
              }
              .service-table tfoot td { 
                padding: 16px 8px;
                border: none;
                font-size: 14px;
              }
              .total-highlight {
                background: linear-gradient(135deg, #ff6b35 0%, #0c96e6 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
                font-size: 24px;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
              }
              .signature-section {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #0c96e6;
              }
              .signature-line { 
                border-top: 2px solid #333; 
                width: 250px; 
                margin: 40px auto 0; 
                text-align: center; 
                padding-top: 8px; 
                font-weight: bold;
              }
              .company-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
                padding: 20px;
                background: linear-gradient(135deg, #0c96e6 0%, #ff6b35 100%);
                color: white;
                border-radius: 8px;
              }
              .receipt-number {
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: bold;
              }
            }
          `}
        </style>

        <div className="print-container bg-white text-black">
          {/* Cabeçalho com gradiente azul e laranja */}
          <div className="company-header">
            <div className="flex items-start space-x-4">
              {user?.companyLogo && (
                <img 
                  src={user.companyLogo} 
                  alt="Logo da Empresa" 
                  className="w-20 h-20 object-contain bg-white rounded-lg p-2" 
                />
              )}
              <div className="space-y-1">
                <div className="text-xl font-bold">{user?.companyName || user?.name}</div>
                {user?.address && <div className="text-sm opacity-90">{user.address}</div>}
                {user?.city && user?.state && <div className="text-sm opacity-90">{user.city}/{user.state}</div>}
                {user?.cnpj && <div className="text-sm opacity-90">CNPJ: {user.cnpj}</div>}
                {user?.phone && <div className="text-sm opacity-90">Tel: {user.phone}</div>}
                {user?.email && <div className="text-sm opacity-90">{user.email}</div>}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold mb-2">RECIBO DE FRETES</h1>
              <div className="receipt-number">
                <div>Data: {formatDateToDDMMAAAA(new Date().toISOString())}</div>
                <div>Nº: {formatDateToDDMMAAAA(new Date().toISOString()).replace(/\//g, '')}-{freights.length.toString().padStart(3, '0')}</div>
              </div>
            </div>
          </div>

          {/* Informações do Cliente com cards modernos */}
          {isSingleClient && firstClient && (
            <div className="info-card">
              <h3 className="text-lg font-bold mb-3 text-freight-700 flex items-center">
                <User className="h-5 w-5 mr-2" />
                DADOS DO CLIENTE
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Nome/Razão Social:</strong> {firstClient.name}</div>
                {firstClient.cnpj && <div><strong>CNPJ:</strong> {firstClient.cnpj}</div>}
                {firstClient.address && <div><strong>Endereço:</strong> {firstClient.address}</div>}
                {firstClient.city && firstClient.state && <div><strong>Cidade/UF:</strong> {firstClient.city}/{firstClient.state}</div>}
                {firstClient.phone && <div><strong>Telefone:</strong> {firstClient.phone}</div>}
                {firstClient.email && <div><strong>Email:</strong> {firstClient.email}</div>}
              </div>
            </div>
          )}

          {!isSingleClient && (
            <div className="info-card border-orange-300 bg-orange-50">
              <h3 className="text-lg font-bold mb-2 text-orange-700 flex items-center">
                <User className="h-5 w-5 mr-2" />
                CLIENTES DIVERSOS
              </h3>
              <p className="text-sm text-orange-600">
                Este recibo contém fretes de múltiplos clientes. Consulte a tabela detalhada abaixo.
              </p>
            </div>
          )}

          {/* Resumo do recibo */}
          <div className="info-card">
            <h3 className="text-lg font-bold mb-3 text-freight-700 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              INFORMAÇÕES DO RECIBO
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Recebi de:</strong> {isSingleClient ? (firstClient?.name || "Cliente não identificado") : "Clientes diversos"}</div>
              <div><strong>A quantia de:</strong> {formatCurrency(totalAmount)} ({totalAmount.toFixed(2).replace('.', ',')} reais)</div>
              <div><strong>Referente a:</strong> Prestação de serviços de transporte {getDateRangeText()}</div>
            </div>
          </div>

          {/* Tabela de serviços com design moderno */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-freight-700 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              DISCRIMINAÇÃO DOS SERVIÇOS
            </h3>
            <table className="service-table">
              <thead>
                <tr>
                  <th><Calendar className="h-4 w-4 inline mr-1" />Data</th>
                  <th><User className="h-4 w-4 inline mr-1" />Solicitante</th>
                  <th><User className="h-4 w-4 inline mr-1" />Cliente</th>
                  <th><MapPin className="h-4 w-4 inline mr-1" />Origem</th>
                  <th><MapPin className="h-4 w-4 inline mr-1" />Destino</th>
                  <th><User className="h-4 w-4 inline mr-1" />Motorista</th>
                  <th><CreditCard className="h-4 w-4 inline mr-1" />Valor</th>
                </tr>
              </thead>
              <tbody>
                {freights.map((freight, index) => {
                  const client = getClientById(freight.clientId);
                  return (
                    <tr key={freight.id}>
                      <td className="font-medium">{formatDateToDDMMAAAA(freight.departureDate)}</td>
                      <td>{freight.requesterName || "Não informado"}</td>
                      <td>{client?.name || "Não identificado"}</td>
                      <td>{freight.originCity || "N/A"}</td>
                      <td>{freight.destinationCity || "N/A"}</td>
                      <td>{freight.driverName || "N/A"}</td>
                      <td className="text-right font-bold text-freight-700">{formatCurrency(freight.totalValue || 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="text-right text-lg">TOTAL GERAL:</td>
                  <td className="text-right text-xl font-bold">{formatCurrency(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Valor Total em destaque */}
          <div className="total-highlight">
            <div className="text-lg mb-1">VALOR TOTAL DOS FRETES</div>
            <div className="text-4xl font-black">{formatCurrency(totalAmount)}</div>
            <div className="text-base mt-1 opacity-90">({freights.length} {freights.length === 1 ? 'frete' : 'fretes'})</div>
          </div>

          {/* Informações adicionais */}
          <div className="info-card">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Forma de Pagamento:</strong> Conforme acordado</div>
              <div><strong>Data de Vencimento:</strong> Conforme contrato</div>
            </div>
            <div className="mt-3">
              <strong>Observações:</strong> Recibo referente aos serviços de transporte prestados conforme discriminado na tabela acima. Todos os valores estão expressos em reais (R$).
            </div>
          </div>

          {/* Seção de assinatura */}
          <div className="signature-section">
            <div className="text-sm space-y-2 mb-6">
              <div><strong>Dados do Prestador:</strong></div>
              <div><strong>Nome:</strong> {user?.name}</div>
              {user?.cpf && <div><strong>CPF:</strong> {user.cpf}</div>}
              {user?.phone && <div><strong>Contato:</strong> {user.phone}</div>}
            </div>

            <div className="signature-line">
              {user?.name}<br />
              <span className="text-xs font-normal">Prestador de Serviços de Transporte</span>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-xs mt-8 pt-4 border-t-2 border-freight-200 text-freight-600">
            <div>{user?.city && user?.state ? `${user.city}/${user.state}` : ''} - {formatDateToDDMMAAAA(new Date().toISOString())}</div>
            <div className="mt-1">Este documento foi gerado eletronicamente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFreightReceiptGenerator;