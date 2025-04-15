
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
      {/* Sender and Recipient */}
      <Card className="border print:border-0 print:shadow-none">
        <CardContent className="p-3 print:p-2 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-semibold text-xs">Remetente:</p>
            <p className="text-xs">{order.sender}</p>
          </div>
          <div>
            <p className="font-semibold text-xs">Destinatário:</p>
            <p className="text-xs">{order.recipient}</p>
          </div>
        </CardContent>
      </Card>

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
          
          <Separator className="my-2" />
          
          <div>
            <p className="font-semibold text-xs">Recebedor:</p>
            <p className="text-xs">{order.receiver || "Não informado"}</p>
            <p className="text-xs mt-1">{order.receiverAddress || "Endereço não informado"}</p>
          </div>
        </CardContent>
      </Card>

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
            
            {order.measurements.map((measurement, index) => (
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

      {/* Driver Info */}
      {order.driverName && (
        <Card className="border print:border-0 print:shadow-none">
          <CardContent className="p-3 print:p-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-xs">Motorista:</p>
                <p className="text-xs">{order.driverName}</p>
              </div>
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
