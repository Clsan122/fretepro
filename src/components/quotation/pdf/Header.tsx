
import React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QuotationData } from "../types";
import Logo from "@/components/Logo";
import { formatCPFCNPJ, formatPhone } from "@/utils/formatters";
import { CreatorInfo } from './helpers';

interface HeaderProps {
  quotation: QuotationData;
  creatorInfo: CreatorInfo;
}

export const QuotationHeader: React.FC<HeaderProps> = ({ quotation, creatorInfo }) => {
  return (
    <div className="bg-gradient-to-r from-freight-50 to-freight-100 p-4 rounded-lg shadow-sm mb-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-freight-700"></div>
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-freight-800 mb-0">Cotação de Frete</h1>
          <p className="text-freight-700 font-medium text-xs">
            N° <span className="text-freight-800">{quotation.orderNumber}</span>
          </p>
          <p className="text-freight-700 text-xs mt-0">
            <span className="font-medium">Emissão:</span> {format(new Date(quotation.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex flex-col items-end mt-2 sm:mt-0">
          <div className="mb-2">
            {quotation.creatorLogo ? (
              <img 
                src={quotation.creatorLogo} 
                alt="Logo da Transportadora" 
                className="w-[120px] h-[70px] object-contain" 
              />
            ) : (
              <Logo variant="full" size="md" className="text-freight-700" />
            )}
          </div>
          <div className="text-right text-xs">
            <p className="font-semibold text-freight-800">{creatorInfo.name}</p>
            {creatorInfo.document && (
              <p className="text-xs text-freight-700">CNPJ: {formatCPFCNPJ(creatorInfo.document)}</p>
            )}
            {creatorInfo.phone && (
              <p className="text-xs text-freight-700">Tel: {formatPhone(creatorInfo.phone)}</p>
            )}
            {creatorInfo.email && (
              <p className="text-xs text-freight-700">E-mail: {creatorInfo.email}</p>
            )}
            {(creatorInfo.address && creatorInfo.city) && (
              <p className="text-xs text-freight-700">
                {creatorInfo.address}, {creatorInfo.city}/{creatorInfo.state}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
