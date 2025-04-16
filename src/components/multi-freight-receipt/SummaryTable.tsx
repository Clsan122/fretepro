
import React from "react";
import { Freight, Client } from "@/types";
import { format } from "date-fns";
import { getClientById } from "@/utils/storage";

interface SummaryTableProps {
  freights: Freight[];
}

const SummaryTable: React.FC<SummaryTableProps> = ({ freights }) => {
  return (
    <div className="scale-down print-compact">
      <h2 className="text-base font-semibold mb-1">RESUMO DE FRETES</h2>
      
      <table className="w-full border-collapse print-table">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1 text-left">Nº</th>
            <th className="border p-1 text-left">Data</th>
            <th className="border p-1 text-left">Cliente</th>
            <th className="border p-1 text-left">Origem-Destino</th>
            <th className="border p-1 text-right">Valor (R$)</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {freights.map((freight, index) => {
            const client = getClientById(freight.clientId);
            return (
              <tr key={freight.id} className="print-tight">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">
                  {format(new Date(freight.createdAt), "dd/MM/yyyy")}
                </td>
                <td className="border p-1">{client?.name || "Cliente não encontrado"}</td>
                <td className="border p-1">
                  {freight.originCity}/{freight.originState} - {freight.destinationCity}/{freight.destinationState}
                </td>
                <td className="border p-1 text-right">
                  {freight.totalValue.toFixed(2)}
                </td>
              </tr>
            );
          })}
          <tr className="font-bold">
            <td colSpan={4} className="border p-1 text-right">Total:</td>
            <td className="border p-1 text-right">
              R$ {freights.reduce((sum, freight) => sum + freight.totalValue, 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
