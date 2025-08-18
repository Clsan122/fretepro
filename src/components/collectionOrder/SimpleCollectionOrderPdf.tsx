import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CollectionOrder } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SimpleCollectionOrderPdfProps {
  order: CollectionOrder;
}

const SimpleCollectionOrderPdf: React.FC<SimpleCollectionOrderPdfProps> = ({
  order,
}) => {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Ordem_Coleta_${order.orderNumber}`,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 print:hidden">
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
                padding: 15mm;
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #000;
                background: white;
              }
              .print-hidden { display: none !important; }
              .border { border: 2px solid #000; }
              .border-thin { border: 1px solid #333; }
              .border-b { border-bottom: 1px solid #333; }
              .border-t { border-top: 1px solid #333; }
              .border-r { border-right: 1px solid #333; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
              .font-bold { font-weight: bold; }
              .text-xl { font-size: 18px; }
              .text-lg { font-size: 16px; }
              .text-sm { font-size: 11px; }
              .text-xs { font-size: 10px; }
              .mb-2 { margin-bottom: 8px; }
              .mb-4 { margin-bottom: 16px; }
              .mb-6 { margin-bottom: 24px; }
              .p-2 { padding: 8px; }
              .p-3 { padding: 12px; }
              .p-4 { padding: 16px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .items-center { align-items: center; }
              .w-full { width: 100%; }
              .w-1-2 { width: 48%; }
              .w-1-3 { width: 32%; }
              .space-y-1 > * + * { margin-top: 4px; }
              .space-y-2 > * + * { margin-top: 8px; }
              .bg-gray { background-color: #f5f5f5; }
              .table { width: 100%; border-collapse: collapse; }
              .table td { padding: 8px; border: 1px solid #333; vertical-align: top; }
            }
          `}
        </style>

        <div className="print-container">
          {/* Cabeçalho */}
          <div className="border p-3 mb-4">
            <div className="flex justify-between items-start">
              <div className="w-1-2">
                {user?.companyLogo && (
                  <img 
                    src={user.companyLogo} 
                    alt="Logo da Empresa" 
                    className="w-24 h-12 object-contain mb-2" 
                  />
                )}
                <div className="space-y-1 text-sm">
                  <div className="font-bold">{order.sender}</div>
                  <div>{order.senderAddress}</div>
                  {order.senderCnpj && <div>CNPJ: {order.senderCnpj}</div>}
                  {user?.phone && <div>Tel: {user.phone}</div>}
                </div>
              </div>
              <div className="text-center w-1-2">
                <h1 className="text-xl font-bold mb-2">ORDEM DE COLETA</h1>
                <div className="border-thin p-2 bg-gray">
                  <div className="font-bold text-lg">Nº {order.orderNumber}</div>
                  <div className="text-sm">Data: {formatDate(order.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações da Transportadora */}
          <div className="mb-4">
            <table className="table">
              <tr>
                <td className="bg-gray font-bold w-1-3">TRANSPORTADOR/RESPONSÁVEL</td>
                <td className="w-1-3">{order.sender}</td>
                <td className="bg-gray font-bold w-1-3">CNPJ/CPF</td>
                <td>{order.senderCnpj || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">ENDEREÇO</td>
                <td colSpan={3}>{order.senderAddress}</td>
              </tr>
            </table>
          </div>

          {/* Remetente e Destinatário */}
          <div className="mb-4">
            <table className="table">
              <tr>
                <td className="bg-gray font-bold text-center" colSpan={2}>REMETENTE</td>
                <td className="bg-gray font-bold text-center" colSpan={2}>DESTINATÁRIO</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">Nome:</td>
                <td>{order.shipper}</td>
                <td className="bg-gray font-bold">Nome:</td>
                <td>{order.recipient}</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">Endereço:</td>
                <td>{order.shipperAddress}</td>
                <td className="bg-gray font-bold">Endereço:</td>
                <td>{order.recipientAddress}</td>
              </tr>
            </table>
          </div>

          {/* Itinerário */}
          <div className="mb-4">
            <table className="table">
              <tr>
                <td className="bg-gray font-bold text-center" colSpan={4}>ITINERÁRIO</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">Cidade Origem:</td>
                <td>{order.originCity}</td>
                <td className="bg-gray font-bold">UF:</td>
                <td>{order.originState}</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">Cidade Destino:</td>
                <td>{order.destinationCity}</td>
                <td className="bg-gray font-bold">UF:</td>
                <td>{order.destinationState}</td>
              </tr>
            </table>
          </div>

          {/* Informações da Carga */}
          <div className="mb-4">
            <table className="table">
              <tr>
                <td className="bg-gray font-bold text-center" colSpan={4}>DADOS DA CARGA</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">Quantidade:</td>
                <td>{order.volumes} volume(s)</td>
                <td className="bg-gray font-bold">Peso Total:</td>
                <td>{order.weight} kg</td>
              </tr>
              <tr>
                <td className="bg-gray font-bold">Valor da Mercadoria:</td>
                <td>R$ {order.merchandiseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="bg-gray font-bold">Nota Fiscal:</td>
                <td>{order.invoiceNumber}</td>
              </tr>
              {order.observations && (
                <tr>
                  <td className="bg-gray font-bold">Descrição/Observações:</td>
                  <td colSpan={3}>{order.observations}</td>
                </tr>
              )}
            </table>
          </div>

          {/* Motorista e Veículo */}
          {(order.driverName || order.licensePlate) && (
            <div className="mb-4">
              <table className="table">
                <tr>
                  <td className="bg-gray font-bold text-center" colSpan={4}>MOTORISTA E VEÍCULO</td>
                </tr>
                <tr>
                  <td className="bg-gray font-bold">Nome do Motorista:</td>
                  <td>{order.driverName || "N/A"}</td>
                  <td className="bg-gray font-bold">CPF:</td>
                  <td>{order.driverCpf || "N/A"}</td>
                </tr>
                <tr>
                  <td className="bg-gray font-bold">Placa do Veículo:</td>
                  <td>{order.licensePlate || "N/A"}</td>
                  <td className="bg-gray font-bold">Data Coleta:</td>
                  <td>____/____/________</td>
                </tr>
              </table>
            </div>
          )}

          {/* Instruções */}
          <div className="mb-6">
            <div className="border-thin p-3">
              <div className="font-bold mb-2">INSTRUÇÕES PARA COLETA:</div>
              <div className="space-y-1 text-sm">
                <div>• Verificar se a mercadoria está de acordo com a descrição</div>
                <div>• Conferir documentos fiscais</div>
                <div>• Anotar observações sobre o estado da mercadoria</div>
                <div>• Obter assinatura do responsável pela entrega</div>
              </div>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="flex justify-between">
            <div className="w-1-2 text-center">
              <div className="border-t border-black mt-16 pt-2">
                <div className="font-bold">REMETENTE</div>
                <div className="text-sm">Assinatura e Carimbo</div>
              </div>
            </div>
            <div className="w-1-2 text-center">
              <div className="border-t border-black mt-16 pt-2">
                <div className="font-bold">TRANSPORTADOR</div>
                <div className="text-sm">Assinatura e Carimbo</div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-xs mt-6 pt-4 border-t">
            <div>Ordem de Coleta emitida em {formatDate(order.createdAt)} via Sistema FreteValor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCollectionOrderPdf;