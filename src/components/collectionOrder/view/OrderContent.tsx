
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
      {order.companyLogo && (
        <div className="flex justify-center mb-4 print:mb-2">
          <img 
            src={order.companyLogo} 
            alt="Logo da Transportadora"
            className="max-h-16 object-contain"
          />
        </div>
      )}

      {/* Sender Details (Requester) */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 text-sm">
          <p className="font-semibold text-xs text-center">SOLICITANTE</p>
          <div className="mt-1 text-center">
            <p className="font-medium text-xs">{order.sender}</p>
            {order.senderCnpj && <p className="text-xs">CNPJ: {order.senderCnpj}</p>}
            {order.senderAddress && <p className="text-xs">{order.senderAddress}</p>}
            {order.senderCity && order.senderState && (
              <p className="text-xs">{order.senderCity} - {order.senderState}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sender and Recipient */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-semibold text-xs">Remetente:</p>
            <p className="text-xs">{order.sender}</p>
            {order.senderAddress && <p className="text-xs mt-1">{order.senderAddress}</p>}
          </div>
          <div>
            <p className="font-semibold text-xs">Destinatário:</p>
            <p className="text-xs">{order.recipient}</p>
            {order.recipientAddress && <p className="text-xs mt-1">{order.recipientAddress}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Shipper and Receiver */}
      {(order.shipper || order.receiver) && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 grid grid-cols-2 gap-2 text-sm">
            {order.shipper && (
              <div>
                <p className="font-semibold text-xs">Expedidor:</p>
                <p className="text-xs">{order.shipper}</p>
                {order.shipperAddress && <p className="text-xs mt-1">{order.shipperAddress}</p>}
              </div>
            )}
            {order.receiver && (
              <div>
                <p className="font-semibold text-xs">Recebedor:</p>
                <p className="text-xs">{order.receiver}</p>
                {order.receiverAddress && <p className="text-xs mt-1">{order.receiverAddress}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Locations */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-semibold text-xs">Origem:</p>
              <p className="text-xs">{order.originCity} - {order.originState}</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Destino:</p>
              <p className="text-xs">{order.destinationCity} - {order.destinationState}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      {order.driverName && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="font-semibold text-xs">Motorista:</p>
                <p className="text-xs">{order.driverName}</p>
              </div>
              {order.driverCpf && (
                <div>
                  <p className="font-semibold text-xs">CPF:</p>
                  <p className="text-xs">{order.driverCpf}</p>
                </div>
              )}
              {order.licensePlate && (
                <div>
                  <p className="font-semibold text-xs">Placa:</p>
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
          <div className="grid grid-cols-4 gap-2">
            <div>
              <p className="font-semibold text-xs">Volumes:</p>
              <p className="text-xs">{order.volumes}</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Peso:</p>
              <p className="text-xs">{order.weight} kg</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Cubagem:</p>
              <p className="text-xs">{order.cubicMeasurement.toFixed(3)} m³</p>
            </div>
            <div>
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
            <p className="font-semibold text-xs mb-2">Medidas:</p>
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
            <p className="font-semibold text-xs">Observações:</p>
            <p className="text-xs whitespace-pre-wrap">{order.observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Signatures */}
      <div className="mt-4 pt-2 border-t border-gray-200 grid grid-cols-2 gap-4 text-xs print:mt-2 print:pt-1">
        <div>
          <p className="font-semibold mb-8 print:mb-4">Expedidor:</p>
          <div className="border-t border-gray-500 w-full"></div>
        </div>
        <div>
          <p className="font-semibold mb-8 print:mb-4">Motorista:</p>
          <div className="border-t border-gray-500 w-full"></div>
        </div>
      </div>
    </div>
  );
};
