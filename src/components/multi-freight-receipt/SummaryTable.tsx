
import React from "react";
import { Freight } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";

interface SummaryTableProps {
  freights: Freight[];
}

const SummaryTable: React.FC<SummaryTableProps> = ({ freights }) => {
  return (
    <div className="mb-4 print-compact">
      <h2 className="text-base font-semibold mb-2">RESUMO DOS FRETES</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse print-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-left text-xs">Data</th>
              <th className="border border-gray-300 p-1 text-left text-xs">Origem</th>
              <th className="border border-gray-300 p-1 text-left text-xs">Destino</th>
              <th className="border border-gray-300 p-1 text-left text-xs">Tipo de Carga</th>
              <th className="border border-gray-300 p-1 text-right text-xs">Valor</th>
            </tr>
          </thead>
          <tbody>
            {freights.map((freight) => (
              <tr key={freight.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-1 text-xs">
                  {format(new Date(freight.createdAt), "dd/MM/yy", { locale: ptBR })}
                </td>
                <td className="border border-gray-300 p-1 text-xs">
                  {freight.originCity}/{freight.originState}
                </td>
                <td className="border border-gray-300 p-1 text-xs">
                  {freight.destinationCity}/{freight.destinationState}
                </td>
                <td className="border border-gray-300 p-1 text-xs">
                  {freight.cargoType}
                </td>
                <td className="border border-gray-300 p-1 text-right text-xs">
                  {formatCurrency(freight.totalValue)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-gray-50">
              <td colSpan={4} className="border border-gray-300 p-1 text-right text-xs">
                Total:
              </td>
              <td className="border border-gray-300 p-1 text-right text-xs">
                {formatCurrency(freights.reduce((sum, f) => sum + f.totalValue, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
