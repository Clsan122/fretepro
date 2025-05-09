
import React from "react";
import { Freight, Client } from "@/types";
import { format } from "date-fns";
import { getClientById } from "@/utils/storage";

interface ClientDetailsSectionProps {
  freightsByClient: Record<string, { client: Client; freights: Freight[] }>;
}

const ClientDetailsSection: React.FC<ClientDetailsSectionProps> = ({ freightsByClient }) => {
  return (
    <div className="scale-down">
      {Object.values(freightsByClient).map(({ client, freights }) => (
        <div key={client.id} className="mb-2 print-compact">
          <h2 className="text-sm font-semibold mb-1">Cliente: {client.name}</h2>
          {client.cnpj && <p className="text-xs mb-1">CNPJ: {client.cnpj}</p>}
          {client.address && <p className="text-xs mb-1 print-small-text">Endereço: {client.address} - {client.city}/{client.state}</p>}
          
          <table className="w-full border-collapse mb-1 print-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1 text-left">Data</th>
                <th className="border p-1 text-left">Origem-Destino</th>
                <th className="border p-1 text-left">Carga</th>
                <th className="border p-1 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {freights.map((freight) => (
                <tr key={freight.id} className="print-tight">
                  <td className="border p-1">
                    {format(new Date(freight.createdAt), "dd/MM/yyyy")}
                  </td>
                  <td className="border p-1">
                    {freight.originCity}/{freight.originState} - {freight.destinationCity}/{freight.destinationState}
                  </td>
                  <td className="border p-1">
                    {freight.cargoType === "general" && "Carga Geral"}
                    {freight.cargoType === "dangerous" && "Carga Perigosa"}
                    {freight.cargoType === "liquid" && "Líquido"}
                    {freight.cargoType === "sackCargo" && "Sacaria"}
                    {freight.cargoType === "drum" && "Tambores"}
                    {freight.cargoType === "pallet" && "Paletizada"}
                  </td>
                  <td className="border p-1 text-right">
                    {freight.totalValue.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="border p-1 text-right">Subtotal:</td>
                <td className="border p-1 text-right">
                  R$ {freights.reduce((sum, f) => sum + f.totalValue, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ClientDetailsSection;
