
import React from "react";
import { QuotationData } from "./types";
import { ClientInfo, CreatorInfo } from "./pdf/helpers";
import { QuotationHeader } from "./pdf/Header";
import { ClientCard } from "./pdf/ClientCard";
import { RouteCard } from "./pdf/RouteCard";
import { CargoDetails } from "./pdf/CargoDetails";
import { DeadlinesCard } from "./pdf/DeadlinesCard";
import { FreightComposition } from "./pdf/FreightComposition";
import { InfoSections } from "./pdf/InfoSections";
import { Footer } from "./pdf/Footer";

interface FreightQuotationPdfProps {
  quotation: QuotationData;
  clientInfo?: ClientInfo;
  creatorInfo: CreatorInfo;
}

export const FreightQuotationPdf: React.FC<FreightQuotationPdfProps> = ({ 
  quotation, 
  clientInfo, 
  creatorInfo 
}) => {
  return (
    <div id="quotation-pdf" className="bg-white p-4 w-full max-w-4xl mx-auto font-sans text-gray-800 text-xs shadow-lg rounded-lg border border-gray-200 print:shadow-none print:border-none">
      {/* Cabeçalho */}
      <QuotationHeader quotation={quotation} creatorInfo={creatorInfo} />
      
      {/* Informações do cliente */}
      {clientInfo && <ClientCard clientInfo={clientInfo} />}
      
      {/* Informações de origem e destino */}
      <RouteCard quotation={quotation} />
      
      {/* Detalhes da carga */}
      <CargoDetails quotation={quotation} />
      
      {/* Prazo de entrega */}
      <DeadlinesCard createdAt={quotation.createdAt} />
      
      {/* Composição do Frete */}
      <FreightComposition quotation={quotation} />
      
      {/* Forma de pagamento e Observações */}
      <InfoSections quotation={quotation} />
      
      {/* Rodapé */}
      <Footer creatorInfo={creatorInfo} />
    </div>
  );
};
