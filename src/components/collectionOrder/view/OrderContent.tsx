
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CollectionOrder } from "@/types";
import { MapPin, Truck, Package, FileText, User, Calendar, Hash } from "lucide-react";

interface OrderContentProps {
  order: CollectionOrder;
}

export const OrderContent: React.FC<OrderContentProps> = ({ order }) => {
  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : '';

  return (
    <div className="space-y-1 print:space-y-0.5">
      {/* Logo e Número da Ordem de Coleta */}
      <div className="flex flex-col items-center mb-2 print:mb-0.5">
        {order.companyLogo && (
          <img 
            src={order.companyLogo} 
            alt="Logo da Transportadora"
            className="max-h-16 print:max-h-10 object-contain mb-1 print:mb-0"
          />
        )}
        <div className="text-center">
          <h2 className="text-xl font-bold text-freight-700 print:text-black mb-0 bg-gradient-to-r from-freight-600 to-freight-800 bg-clip-text text-transparent print:bg-none print:text-black">
            ORDEM DE COLETA
          </h2>
          <div className="flex items-center justify-center gap-1">
            <Hash className="h-3 w-3" />
            <p className="text-base font-semibold text-freight-700 print:text-black">
              {order.orderNumber}
            </p>
            <span className="mx-1 text-gray-400">|</span>
            <Calendar className="h-3 w-3" />
            <p className="text-sm text-gray-600">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Layout compacto para impressão */}
      <div className="print:grid print:grid-cols-2 print:gap-1">
        {/* Coluna 1 - Transportadora e Remetente/Destinatário */}
        <div className="print:space-y-0.5">
          {/* Dados da Transportadora */}
          {order.sender && (
            <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
              <CardContent className="p-2 print:p-0.5 bg-gradient-to-r from-freight-50 to-white print:bg-none">
                <h3 className="font-semibold text-freight-700 print:text-black mb-1 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  DADOS DA TRANSPORTADORA:
                </h3>
                <div className="flex flex-col items-start text-xs">
                  {/* Logo da transportadora na seção de dados */}
                  {order.senderLogo && (
                    <div className="mb-2 w-full flex justify-center">
                      <img 
                        src={order.senderLogo} 
                        alt="Logo da Transportadora" 
                        className="max-h-12 max-w-[120px] object-contain"
                      />
                    </div>
                  )}
                  <p className="font-semibold">{order.sender}</p>
                  {order.senderCnpj && <p className="text-xs font-medium">CNPJ: {order.senderCnpj}</p>}
                  {order.senderAddress && <p className="text-xs">{order.senderAddress}</p>}
                  {(order.senderCity && order.senderState) && (
                    <p className="text-xs">{order.senderCity} - {order.senderState}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações de Remetente e Destinatário - Layout compacto */}
          <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
            <CardContent className="p-2 print:p-0.5 grid grid-cols-1 md:grid-cols-2 gap-1 print:gap-0.5 text-xs">
              <div className="space-y-0 border-b md:border-b-0 md:border-r pb-1 md:pb-0 md:pr-1 print:pb-0 print:pr-1 print:border-r print:border-b-0">
                <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                  <User className="h-2 w-2" />
                  REMETENTE:
                </p>
                <p className="text-xs">{order.shipper}</p>
                {order.shipperAddress && <p className="text-xs text-gray-600">{order.shipperAddress}</p>}
              </div>
              
              <div className="space-y-0">
                <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                  <MapPin className="h-2 w-2" />
                  DESTINATÁRIO:
                </p>
                <p className="text-xs">{order.recipient}</p>
                {order.recipientAddress && <p className="text-xs text-gray-600">{order.recipientAddress}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Locations - Layout compacto */}
          <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
            <CardContent className="p-2 print:p-0.5 space-y-0.5 text-xs">
              <div className="grid grid-cols-2 gap-1 print:gap-0.5">
                <div className="space-y-0 p-1 rounded print:p-0">
                  <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                    <MapPin className="h-2 w-2" />
                    ORIGEM:
                  </p>
                  <p className="text-xs">{order.originCity} - {order.originState}</p>
                </div>
                <div className="space-y-0 p-1 rounded print:p-0">
                  <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                    <MapPin className="h-2 w-2" />
                    DESTINO:
                  </p>
                  <p className="text-xs">{order.destinationCity} - {order.destinationState}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Info - Layout compacto */}
          {order.driverName && (
            <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
              <CardContent className="p-2 print:p-0.5 text-xs">
                <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                  <User className="h-2 w-2" />
                  MOTORISTA:
                </p>
                <div className="grid grid-cols-3 gap-1 print:gap-0.5">
                  <p className="text-xs">{order.driverName}</p>
                  {order.driverCpf && (
                    <p className="text-xs">CPF: {order.driverCpf}</p>
                  )}
                  {order.licensePlate && (
                    <p className="text-xs">Placa: {order.licensePlate}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna 2 - Detalhes da carga e Observações */}
        <div className="print:space-y-0.5">
          {/* Cargo Details - Layout compacto */}
          <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
            <CardContent className="p-2 print:p-0.5 text-xs">
              <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                <Package className="h-2 w-2" />
                DETALHES DA CARGA:
              </p>
              <div className="grid grid-cols-4 gap-1 print:gap-0.5 p-1 rounded print:p-0">
                <div className="space-y-0">
                  <p className="font-semibold text-xs">Volumes:</p>
                  <p className="text-xs">{order.volumes}</p>
                </div>
                <div className="space-y-0">
                  <p className="font-semibold text-xs">Peso:</p>
                  <p className="text-xs">{order.weight} kg</p>
                </div>
                <div className="space-y-0">
                  <p className="font-semibold text-xs">Cubagem:</p>
                  <p className="text-xs">{order.cubicMeasurement?.toFixed(3) || "0.000"} m³</p>
                </div>
                <div className="space-y-0">
                  <p className="font-semibold text-xs">Valor:</p>
                  <p className="text-xs">
                    {typeof order.merchandiseValue === 'number' 
                      ? order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : "R$ 0,00"}
                  </p>
                </div>
              </div>
              
              {order.invoiceNumber && (
                <div className="mt-0.5">
                  <p className="font-semibold text-xs">Número NF/Pedido:</p>
                  <p className="text-xs">{order.invoiceNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Measurements - Layout compacto */}
          {Array.isArray(order.measurements) && order.measurements.length > 0 && (
            <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
              <CardContent className="p-2 print:p-0.5 text-xs">
                <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                  <Package className="h-2 w-2" />
                  MEDIDAS:
                </p>
                <div className="p-1 rounded print:p-0">
                  <div className="grid grid-cols-4 gap-0.5 text-xs font-medium text-freight-700">
                    <div>C (cm)</div>
                    <div>L (cm)</div>
                    <div>A (cm)</div>
                    <div>Qtd</div>
                  </div>
                  
                  {Array.isArray(order.measurements) && order.measurements.map((measurement) => (
                    <div key={measurement.id} className="grid grid-cols-4 gap-0.5 text-xs py-0.5 border-b border-gray-50 last:border-0">
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

          {/* Observations if present - Layout compacto */}
          {order.observations && (
            <Card className="border border-freight-100 print:border-gray-200 print:border-0 print:shadow-none overflow-hidden mb-1 print:mb-0.5">
              <CardContent className="p-2 print:p-0.5 text-xs">
                <p className="font-semibold text-freight-700 print:text-black mb-0 flex items-center gap-1">
                  <FileText className="h-2 w-2" />
                  OBSERVAÇÕES:
                </p>
                <p className="text-xs whitespace-pre-wrap p-1 rounded print:p-0">{order.observations}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Signatures - Layout mais compacto */}
      <div className="mt-2 pt-1 border-t border-freight-200 grid grid-cols-2 gap-4 text-xs print:mt-1 print:pt-0.5 print:gap-2">
        <div>
          <p className="font-semibold text-freight-700 mb-4 print:mb-3 print:text-black">EXPEDIDOR:</p>
          <div className="border-t border-freight-700 w-full"></div>
        </div>
        <div>
          <p className="font-semibold text-freight-700 mb-4 print:mb-3 print:text-black">MOTORISTA:</p>
          <div className="border-t border-freight-700 w-full"></div>
        </div>
      </div>
    </div>
  );
};
