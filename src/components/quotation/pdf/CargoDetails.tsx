
import React from 'react';
import { QuotationData } from "../types";
import { getCargoTypeInPortuguese, getVehicleTypeInPortuguese } from './helpers';
import { formatCurrency } from '@/utils/formatters';

interface CargoDetailsProps {
  quotation: QuotationData;
}

export const CargoDetails: React.FC<CargoDetailsProps> = ({ quotation }) => {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Detalhes da Carga</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <tbody>
            <tr className="border-b border-gray-200 bg-freight-50">
              <td className="py-1 px-2 font-medium text-freight-800">Volumes:</td>
              <td className="py-1 px-2 text-freight-700">{quotation.volumes}</td>
              <td className="py-1 px-2 font-medium text-freight-800">Peso:</td>
              <td className="py-1 px-2 text-freight-700">{quotation.weight} kg</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-1 px-2 font-medium text-freight-800">Tipo de Carga:</td>
              <td className="py-1 px-2 text-freight-700">{getCargoTypeInPortuguese(quotation.cargoType)}</td>
              <td className="py-1 px-2 font-medium text-freight-800">Veículo:</td>
              <td className="py-1 px-2 text-freight-700">{getVehicleTypeInPortuguese(quotation.vehicleType) || "A definir"}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 font-medium text-freight-800">Valor da Mercadoria:</td>
              <td className="py-1 px-2 text-freight-700" colSpan={3}>{formatCurrency(quotation.merchandiseValue)}</td>
            </tr>
            {quotation.measurements && quotation.measurements.length > 0 && (
              <tr className="border-t border-gray-200 bg-freight-50">
                <td className="py-1 px-2 font-medium text-freight-800">Dimensões:</td>
                <td className="py-1 px-2" colSpan={3}>
                  <div className="flex flex-wrap gap-1">
                    {quotation.measurements.map((measurement, index) => (
                      <div key={measurement.id} className="text-freight-700 py-0 px-1 rounded-md bg-white border border-gray-100 text-xs">
                        <span className="font-medium text-freight-800">{index + 1}.</span> {measurement.length}x{measurement.width}x{measurement.height}cm
                        {measurement.quantity > 1 ? ` (${measurement.quantity}x)` : ''}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
