
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CollectionOrder } from "@/types";
import { MapPin, Truck, Package, FileText, User } from "lucide-react";

interface OrderContentProps {
  order: CollectionOrder;
}

export const OrderContent: React.FC<OrderContentProps> = ({ order }) => {
  return (
    <div className="space-y-4 print:space-y-2">
      {/* Logo e Número da Ordem de Coleta */}
      <div className="flex flex-col items-center mb-6 print:mb-2">
        {order.companyLogo && (
          <img 
            src={order.companyLogo} 
            alt="Logo da Transportadora"
            className="max-h-24 print:max-h-16 object-contain mb-4 print:mb-2"
          />
        )}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-freight-700 print:text-black mb-2 bg-gradient-to-r from-freight-600 to-freight-800 bg-clip-text text-transparent print:bg-none print:text-black">
            ORDEM DE COLETA
          </h2>
          <p className="text-lg font-semibold text-freight-700 print:text-black">
            Nº {order.orderNumber}
          </p>
        </div>
      </div>

      {/* Dados da Transportadora - Seção Separada */}
      {order.sender && (
        <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
          <CardContent className="p-4 print:p-2 bg-gradient-to-r from-freight-50 to-white print:bg-none">
            <h3 className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              DADOS DA TRANSPORTADORA:
            </h3>
            <div className="text-center text-sm">
              <p className="font-semibold">{order.sender}</p>
              {order.senderCnpj && <p className="text-xs">CNPJ: {order.senderCnpj}</p>}
              {order.senderAddress && <p className="text-xs mt-1">{order.senderAddress}</p>}
              {(order.senderCity && order.senderState) && (
                <p className="text-xs">{order.senderCity} - {order.senderState}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações de Remetente e Destinatário */}
      <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
        <CardContent className="p-4 print:p-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 text-sm">
          <div className="space-y-1 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-3 print:pb-0 print:pr-3 print:border-r print:border-b-0">
            <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              REMETENTE:
            </p>
            <p className="text-sm">{order.shipper || order.sender}</p>
            {order.shipperAddress && <p className="text-xs text-gray-600">{order.shipperAddress}</p>}
            {(!order.shipperAddress && order.senderAddress) && <p className="text-xs text-gray-600">{order.senderAddress}</p>}
          </div>
          
          <div className="space-y-1">
            <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              DESTINATÁRIO:
            </p>
            <p className="text-sm">{order.recipient}</p>
            {order.recipientAddress && <p className="text-xs text-gray-600">{order.recipientAddress}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Expedidor e Recebedor - Se existirem dados diferentes dos já exibidos */}
      {(order.receiver) && (
        <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
          <CardContent className="p-4 print:p-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 text-sm">
            {order.receiver && (
              <div className="space-y-1">
                <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  RECEBEDOR:
                </p>
                <p className="text-sm">{order.receiver}</p>
                {order.receiverAddress && <p className="text-xs text-gray-600">{order.receiverAddress}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Locations */}
      <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
        <CardContent className="p-4 print:p-2 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
            <div className="space-y-1">
              <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                ORIGEM:
              </p>
              <p className="text-sm">{order.originCity} - {order.originState}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                DESTINO:
              </p>
              <p className="text-sm">{order.destinationCity} - {order.destinationState}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      {order.driverName && (
        <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
          <CardContent className="p-4 print:p-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
              <div className="space-y-1">
                <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  MOTORISTA:
                </p>
                <p className="text-sm">{order.driverName}</p>
              </div>
              {order.driverCpf && (
                <div className="space-y-1">
                  <p className="font-semibold text-freight-700 print:text-black mb-2">CPF:</p>
                  <p className="text-sm">{order.driverCpf}</p>
                </div>
              )}
              {order.licensePlate && (
                <div className="space-y-1">
                  <p className="font-semibold text-freight-700 print:text-black mb-2">PLACA:</p>
                  <p className="text-sm">{order.licensePlate}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cargo Details */}
      <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
        <CardContent className="p-4 print:p-2 text-sm">
          <p className="font-semibold text-freight-700 pb-2 print:text-black flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            DETALHES DA CARGA:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2 bg-freight-50/50 p-3 rounded-md print:bg-transparent">
            <div className="space-y-1">
              <p className="font-semibold text-xs">Volumes:</p>
              <p className="text-sm">{order.volumes}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs">Peso:</p>
              <p className="text-sm">{order.weight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs">Cubagem:</p>
              <p className="text-sm">{order.cubicMeasurement.toFixed(3)} m³</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs">Valor:</p>
              <p className="text-sm">
                {order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
          
          {order.invoiceNumber && (
            <div className="mt-3">
              <p className="font-semibold text-xs">Número NF/Pedido:</p>
              <p className="text-sm">{order.invoiceNumber}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurements */}
      {order.measurements.length > 0 && (
        <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
          <CardContent className="p-4 print:p-2 text-sm">
            <p className="font-semibold text-freight-700 mb-2 print:text-black flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              MEDIDAS:
            </p>
            <div className="bg-freight-50/50 p-3 rounded-md print:bg-transparent">
              <div className="grid grid-cols-4 gap-1 text-xs font-medium text-freight-700">
                <div>C (cm)</div>
                <div>L (cm)</div>
                <div>A (cm)</div>
                <div>Qtd</div>
              </div>
              
              {order.measurements.map((measurement) => (
                <div key={measurement.id} className="grid grid-cols-4 gap-1 text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <div>{measurement.length}</div>
                  <div>{measurement.width}</div>
                  <div>{measurement.height}</div>
                  <div>{measurement.quantity}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observations if present */}
      {order.observations && (
        <Card className="border border-freight-100 print:border-0 print:shadow-none overflow-hidden">
          <CardContent className="p-4 print:p-2 text-sm">
            <p className="font-semibold text-freight-700 print:text-black mb-2 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              OBSERVAÇÕES:
            </p>
            <p className="text-sm whitespace-pre-wrap bg-freight-50/50 p-3 rounded-md print:bg-transparent">{order.observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Signatures */}
      <div className="mt-8 pt-4 border-t border-freight-200 grid grid-cols-2 gap-8 text-xs print:mt-4 print:pt-2">
        <div>
          <p className="font-semibold text-freight-700 mb-12 print:mb-8 print:text-black">EXPEDIDOR:</p>
          <div className="border-t border-freight-700 w-full"></div>
        </div>
        <div>
          <p className="font-semibold text-freight-700 mb-12 print:mb-8 print:text-black">MOTORISTA:</p>
          <div className="border-t border-freight-700 w-full"></div>
        </div>
      </div>
    </div>
  );
};
