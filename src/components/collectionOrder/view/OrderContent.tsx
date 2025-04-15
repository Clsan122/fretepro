
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CollectionOrder } from "@/types";

interface OrderContentProps {
  order: CollectionOrder;
}

export const OrderContent: React.FC<OrderContentProps> = ({ order }) => {
  return (
    <>
      <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
        <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
          <CardTitle className="text-lg print:text-sm">Dados do Remetente e Destinatário</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2 print-compact-grid py-2 px-4 print:p-2 print:pt-0 print-small-text">
          <div>
            <p className="font-semibold">Remetente / Exportador:</p>
            <p className="print-smaller-text">{order.sender}</p>
          </div>
          <div>
            <p className="font-semibold">Destinatário / Importador:</p>
            <p className="print-smaller-text">{order.recipient}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
        <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
          <CardTitle className="text-lg print:text-sm">Informações de Localização</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 print:p-2 print:pt-0 print-small-text">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2 print-compact-grid mb-2 print:mb-1">
            <div>
              <p className="font-semibold">Origem:</p>
              <p className="print-smaller-text">{order.originCity} - {order.originState}</p>
            </div>
            <div>
              <p className="font-semibold">Destino:</p>
              <p className="print-smaller-text">{order.destinationCity} - {order.destinationState}</p>
            </div>
          </div>
          
          <Separator className="my-2 print:my-1" />
          
          <div className="space-y-2 print:space-y-1">
            <div>
              <p className="font-semibold">Recebedor / Destinatário:</p>
              <p className="print-smaller-text">{order.receiver || "Não informado"}</p>
            </div>
            
            <div>
              <p className="font-semibold">Endereço do Destinatário:</p>
              <p className="print-smaller-text">{order.receiverAddress || "Não informado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
        <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
          <CardTitle className="text-lg print:text-sm">Dados da Carga</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:gap-2 print:grid-cols-4 print-compact-grid py-2 px-4 print:p-2 print:pt-0 print-small-text">
          <div>
            <p className="font-semibold">Volumes:</p>
            <p className="print-smaller-text">{order.volumes}</p>
          </div>
          <div>
            <p className="font-semibold">Peso (kg):</p>
            <p className="print-smaller-text">{order.weight}</p>
          </div>
          <div>
            <p className="font-semibold">Cubagem (m³):</p>
            <p className="print-smaller-text">{order.cubicMeasurement.toFixed(3)}</p>
          </div>
          <div>
            <p className="font-semibold">Valor (R$):</p>
            <p className="print-smaller-text">
              {order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {order.measurements.length > 0 && (
        <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
          <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
            <CardTitle className="text-lg print:text-sm">Medidas</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 print:p-2 print:pt-0 print-small-text">
            <div className="grid grid-cols-4 gap-2 font-semibold mb-1 print:text-xs">
              <div>Comprimento (cm)</div>
              <div>Largura (cm)</div>
              <div>Altura (cm)</div>
              <div>Quantidade</div>
            </div>
            
            {order.measurements.map((measurement) => (
              <div key={measurement.id} className="grid grid-cols-4 gap-2 py-1 border-b border-gray-100 print-smaller-text">
                <div>{measurement.length}</div>
                <div>{measurement.width}</div>
                <div>{measurement.height}</div>
                <div>{measurement.quantity}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {order.driverName && (
        <Card className="card-compact border print:border-0 print:shadow-none">
          <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
            <CardTitle className="text-lg print:text-sm">Dados do Motorista</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2 print-compact-grid py-2 px-4 print:p-2 print:pt-0 print-small-text">
            <div>
              <p className="font-semibold">Motorista:</p>
              <p className="print-smaller-text">{order.driverName}</p>
            </div>
            {order.licensePlate && (
              <div>
                <p className="font-semibold">Placa do Veículo:</p>
                <p className="print-smaller-text">{order.licensePlate}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 print:mt-3 print:pt-2 print:grid-cols-2 print-small-text print:gap-2">
        <div>
          <p className="font-semibold mb-16 print:mb-8">Assinatura do Expedidor:</p>
          <div className="border-t border-gray-500 w-full"></div>
        </div>
        <div>
          <p className="font-semibold mb-16 print:mb-8">Assinatura do Motorista:</p>
          <div className="border-t border-gray-500 w-full"></div>
        </div>
      </div>
    </>
  );
};
