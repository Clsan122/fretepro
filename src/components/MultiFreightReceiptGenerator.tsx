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

  console.log('=== DEBUG MultiFreightReceiptGenerator ===');
  console.log('Freights received:', freights);
  console.log('User:', user);

  if (!freights || freights.length === 0) {
    console.log('Nenhum frete fornecido para o gerador');
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Nenhum frete encontrado para gerar o recibo.</p>
      </div>
    );
  }

  if (!user) {
    console.log('Usuário não encontrado');
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
      <div className="flex gap-3">
        <Button 
          onClick={() => handlePrint()} 
          className="bg-gradient-to-r from-freight-600 to-accent hover:from-freight-700 hover:to-accent-dark text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          size="lg"
        >
          <Printer className="h-5 w-5 mr-2" />
          Gerar PDF do Recibo Múltiplo
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
                font-family: 'Arial', sans-serif;
              }
              * { box-sizing: border-box; }
              .print-container { 
                width: 210mm; 
                min-height: 297mm; 
                padding: 20mm;
                font-size: 12px;
                line-height: 1.5;
                color: #000;
                background: white;
                page-break-inside: avoid;
              }
              .print-hidden { display: none !important; }
              .header-section { 
                background: linear-gradient(135deg, #0c96e6 0%, #ff6b35 100%) !important; 
                color: white !important;
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
              }
              .receipt-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                border: 3px solid #0c96e6;
                border-radius: 12px;
                overflow: hidden;
              }
              .receipt-table th { 
                background: linear-gradient(135deg, #0c96e6 0%, #ff6b35 100%);
                color: white;
                padding: 15px 12px; 
                text-align: left; 
                font-weight: bold;
                font-size: 11px;
              }
              .receipt-table td { 
                padding: 12px; 
                border-bottom: 1px solid #e5e7eb;
                font-size: 11px;
              }
              .receipt-table tbody tr:nth-child(even) { 
                background: #f8fafc; 
              }
              .receipt-table tbody tr:hover { 
                background: #e0f2fe; 
              }
              .total-section {
                background: linear-gradient(135deg, #ff6b35 0%, #0c96e6 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                margin: 30px 0;
                box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
              }
              .total-value {
                font-size: 48px;
                font-weight: 900;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                margin: 15px 0;
              }
              .company-info {
                border: 2px solid #0c96e6;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
              }
              .signature-area {
                margin-top: 50px;
                padding-top: 30px;
                border-top: 3px solid #0c96e6;
                text-align: center;
              }
              .signature-line { 
                border-top: 2px solid #333; 
                width: 300px; 
                margin: 50px auto 0; 
                text-align: center; 
                padding-top: 10px; 
                font-weight: bold;
              }
            }
          `}
        </style>

        <div className="print-container bg-white text-black">
          {/* Cabeçalho com gradiente */}
          <div className="header-section">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-6">
                {user?.companyLogo && (
                  <img 
                    src={user.companyLogo} 
                    alt="Logo da Empresa" 
                    className="w-24 h-24 object-contain bg-white rounded-xl p-3 shadow-lg" 
                  />
                )}
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{user?.companyName || user?.name}</div>
                  {user?.address && <div className="text-sm opacity-90">{user.address}</div>}
                  {user?.city && user?.state && <div className="text-sm opacity-90">{user.city}/{user.state}</div>}
                  {user?.cnpj && <div className="text-sm opacity-90">CNPJ: {user.cnpj}</div>}
                  {user?.phone && <div className="text-sm opacity-90">Tel: {user.phone}</div>}
                  {user?.email && <div className="text-sm opacity-90">{user.email}</div>}
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-black mb-3">RECIBO DE FRETES</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm">Data: {formatDateToDDMMAAAA(new Date().toISOString())}</div>
                  <div className="text-sm">Nº: {formatDateToDDMMAAAA(new Date().toISOString()).replace(/\//g, '')}-{freights.length.toString().padStart(3, '0')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do recibo */}
          <div className="company-info">
            <h3 className="text-xl font-bold mb-4 text-freight-700 flex items-center">
              <FileText className="h-6 w-6 mr-3" />
              INFORMAÇÕES DO RECIBO
            </h3>
            <div className="space-y-3 text-sm">
              <div><strong>A quantia de:</strong> {formatCurrency(totalAmount)} ({totalAmount.toFixed(2).replace('.', ',')} reais)</div>
              <div><strong>Referente a:</strong> Prestação de serviços de transporte {getDateRangeText()}</div>
              <div><strong>Quantidade de fretes:</strong> {freights.length} {freights.length === 1 ? 'frete' : 'fretes'}</div>
            </div>
          </div>

          {/* Tabela principal com as informações solicitadas */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6 text-freight-700 flex items-center">
              <MapPin className="h-6 w-6 mr-3" />
              DISCRIMINAÇÃO DOS SERVIÇOS
            </h3>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th className="w-20"><Calendar className="h-4 w-4 inline mr-2" />Data</th>
                  <th><User className="h-4 w-4 inline mr-2" />Cliente</th>
                  <th><MapPin className="h-4 w-4 inline mr-2" />Origem → Destino</th>
                  <th><User className="h-4 w-4 inline mr-2" />Solicitante</th>
                  <th className="w-32 text-right"><CreditCard className="h-4 w-4 inline mr-2" />Valor do Frete</th>
                </tr>
              </thead>
              <tbody>
                {freights.map((freight, index) => {
                  const client = getClientById(freight.clientId);
                  return (
                    <tr key={freight.id}>
                      <td className="font-medium text-center">{formatDateToDDMMAAAA(freight.departureDate)}</td>
                      <td className="font-medium">{client?.name || "Cliente não identificado"}</td>
                      <td>
                        <div className="font-medium text-freight-700">
                          {freight.originCity || "N/A"} → {freight.destinationCity || "N/A"}
                        </div>
                      </td>
                      <td>{freight.requesterName || "Não informado"}</td>
                      <td className="text-right font-bold text-lg text-freight-700">
                        {formatCurrency(freight.totalValue || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Valor Total em destaque grande */}
          <div className="total-section">
            <div className="text-xl mb-2">VALOR TOTAL DOS FRETES</div>
            <div className="total-value">{formatCurrency(totalAmount)}</div>
            <div className="text-lg mt-2 opacity-90">
              ({freights.length} {freights.length === 1 ? 'frete processado' : 'fretes processados'})
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="company-info">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div><strong>Forma de Pagamento:</strong> Conforme acordado</div>
              <div><strong>Data de Vencimento:</strong> Conforme contrato</div>
            </div>
            <div className="mt-4">
              <strong>Observações:</strong> Recibo referente aos serviços de transporte prestados conforme discriminado na tabela acima. Todos os valores estão expressos em reais (R$).
            </div>
          </div>

          {/* Seção de assinatura */}
          <div className="signature-area">
            <div className="text-sm space-y-2 mb-8">
              <div><strong>Dados do Prestador:</strong></div>
              <div><strong>Nome:</strong> {user?.name}</div>
              {user?.cpf && <div><strong>CPF:</strong> {user.cpf}</div>}
              {user?.phone && <div><strong>Contato:</strong> {user.phone}</div>}
            </div>

            <div className="signature-line">
              {user?.name}<br />
              <span className="text-sm font-normal">Prestador de Serviços de Transporte</span>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-sm mt-10 pt-6 border-t-2 border-freight-200 text-freight-600">
            <div>{user?.city && user?.state ? `${user.city}/${user.state}` : ''} - {formatDateToDDMMAAAA(new Date().toISOString())}</div>
            <div className="mt-2 font-medium">Este documento foi gerado eletronicamente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;