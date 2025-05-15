
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CollectionOrder } from "@/types";

interface OrderContentProps {
  order: CollectionOrder;
}

export const OrderContent: React.FC<OrderContentProps> = ({ order }) => {
  return (
    <div className="space-y-3 print:space-y-2">
      {/* Logo e Número da Ordem de Coleta */}
      <div className="flex flex-col items-center mb-4 print:mb-2">
        {order.companyLogo && (
          <img 
            src={order.companyLogo} 
            alt="Logo da Transportadora"
            className="max-h-20 print:max-h-16 object-contain mb-3 print:mb-2"
          />
        )}
        <div className="text-center">
          <h2 className="text-xl font-bold text-freight-700 print:text-black mb-1">
            ORDEM DE COLETA
          </h2>
          <p className="text-lg font-semibold text-freight-700 print:text-black">
            Nº {order.orderNumber}
          </p>
        </div>
      </div>

      {/* Dados da empresa transportadora */}
      {order.sender && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 text-center text-sm">
            <p className="font-semibold">{order.sender}</p>
            {order.senderCnpj && <p className="text-xs">CNPJ: {order.senderCnpj}</p>}
            {order.senderAddress && <p className="text-xs mt-1">{order.senderAddress}</p>}
            {(order.senderCity && order.senderState) && (
              <p className="text-xs">{order.senderCity} - {order.senderState}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações de Remetente e Destinatário */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 text-sm">
          <div className="space-y-1 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-3 print:pb-0 print:pr-3 print:border-r print:border-b-0">
            <p className="font-semibold text-xs text-freight-700 print:text-black">REMETENTE:</p>
            <p className="text-xs">{order.sender}</p>
            {order.senderAddress && <p className="text-xs">{order.senderAddress}</p>}
            {(order.senderCity && order.senderState) && (
              <p className="text-xs">{order.senderCity} - {order.senderState}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="font-semibold text-xs text-freight-700 print:text-black">DESTINATÁRIO:</p>
            <p className="text-xs">{order.recipient}</p>
            {order.recipientAddress && <p className="text-xs">{order.recipientAddress}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Shipper and Receiver */}
      {(order.shipper || order.receiver) && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 text-sm">
            {order.shipper && (
              <div className="space-y-1">
                <p className="font-semibold text-xs text-freight-700 print:text-black">EXPEDIDOR:</p>
                <p className="text-xs">{order.shipper}</p>
                {order.shipperAddress && <p className="text-xs">{order.shipperAddress}</p>}
              </div>
            )}
            {order.receiver && (
              <div className="space-y-1">
                <p className="font-semibold text-xs text-freight-700 print:text-black">RECEBEDOR:</p>
                <p className="text-xs">{order.receiver}</p>
                {order.receiverAddress && <p className="text-xs">{order.receiverAddress}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Locations */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
            <div className="space-y-1">
              <p className="font-semibold text-xs text-freight-700 print:text-black">ORIGEM:</p>
              <p className="text-xs">{order.originCity} - {order.originState}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs text-freight-700 print:text-black">DESTINO:</p>
              <p className="text-xs">{order.destinationCity} - {order.destinationState}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      {order.driverName && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
              <div className="space-y-1">
                <p className="font-semibold text-xs text-freight-700 print:text-black">MOTORISTA:</p>
                <p className="text-xs">{order.driverName}</p>
              </div>
              {order.driverCpf && (
                <div className="space-y-1">
                  <p className="font-semibold text-xs text-freight-700 print:text-black">CPF:</p>
                  <p className="text-xs">{order.driverCpf}</p>
                </div>
              )}
              {order.licensePlate && (
                <div className="space-y-1">
                  <p className="font-semibold text-xs text-freight-700 print:text-black">PLACA:</p>
                  <p className="text-xs">{order.licensePlate}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cargo Details */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 text-sm">
          <p className="font-semibold text-xs text-freight-700 pb-2 print:text-black">DETALHES DA CARGA:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
            <div className="space-y-1">
              <p className="font-semibold text-xs">Volumes:</p>
              <p className="text-xs">{order.volumes}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs">Peso:</p>
              <p className="text-xs">{order.weight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs">Cubagem:</p>
              <p className="text-xs">{order.cubicMeasurement.toFixed(3)} m³</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xs">Valor:</p>
              <p className="text-xs">
                {order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
          
          {order.invoiceNumber && (
            <div className="mt-2">
              <p className="font-semibold text-xs">Número NF/Pedido:</p>
              <p className="text-xs">{order.invoiceNumber}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurements */}
      {order.measurements.length > 0 && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 text-sm">
            <p className="font-semibold text-xs text-freight-700 mb-2 print:text-black">MEDIDAS:</p>
            <div className="grid grid-cols-4 gap-1 text-xs font-medium">
              <div>C (cm)</div>
              <div>L (cm)</div>
              <div>A (cm)</div>
              <div>Qtd</div>
            </div>
            
            {order.measurements.map((measurement) => (
              <div key={measurement.id} className="grid grid-cols-4 gap-1 text-xs py-1 border-b border-gray-100 last:border-0">
                <div>{measurement.length}</div>
                <div>{measurement.width}</div>
                <div>{measurement.height}</div>
                <div>{measurement.quantity}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Observations if present */}
      {order.observations && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 text-sm">
            <p className="font-semibold text-xs text-freight-700 print:text-black">OBSERVAÇÕES:</p>
            <p className="text-xs whitespace-pre-wrap">{order.observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Signatures */}
      <div className="mt-8 pt-4 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs print:mt-4 print:pt-2">
        <div>
          <p className="font-semibold text-freight-700 mb-12 print:mb-8 print:text-black">EXPEDIDOR:</p>
          <div className="border-t border-gray-500 w-full"></div>
        </div>
        <div>
          <p className="font-semibold text-freight-700 mb-12 print:mb-8 print:text-black">MOTORISTA:</p>
          <div className="border-t border-gray-500 w-full"></div>
        </div>
      </div>
    </div>
  );
};
