
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import QuotationViewActions from "@/components/quotation/view/QuotationViewActions";
import QuotationContent from "@/components/quotation/view/QuotationContent";
import QuotationLoading from "@/components/quotation/view/QuotationLoading";
import { useQuotationView } from "@/hooks/quotation/useQuotationView";
import { QuotationData } from "@/components/quotation/types";

const QuotationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    quotation,
    loading,
    sending,
    generating,
    sharing,
    previewing,
    handlePreviewPdf,
    handleSharePdf,
    handleSendQuotation,
    handleEdit
  } = useQuotationView(id);
  
  if (loading || !quotation) {
    return <QuotationLoading isLoading={loading} notFound={!loading && !quotation} />;
  }

  // Transform quotation to match QuotationData interface
  const quotationData: QuotationData = {
    ...quotation,
    // Mapeando propriedades corretamente
    cargoWeight: quotation.weight || 0,
    measurements: quotation.measurements || [],
    
    // Removendo propriedades que não existem em QuotationData
    // cargoWeight já foi mapeado acima
    // cubicMeasurement não existe em QuotationData, usar o existente
    // Mapeando propriedades de preço corretamente se existirem
    ...(quotation.pricePerKm && { pricePerKm: quotation.pricePerKm }),
    ...(quotation.tollCost && { tollCost: quotation.tollCost }),
    ...(quotation.additionalCosts && { additionalCosts: quotation.additionalCosts }),
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto pb-20 md:pb-10 px-2 sm:px-4">
        <QuotationViewActions 
          id={id!}
          quotation={quotation}
          sending={sending}
          generating={generating}
          sharing={sharing}
          handleSharePdf={handleSharePdf}
          handleSendQuotation={handleSendQuotation}
          handleEdit={handleEdit}
          handlePreviewPdf={handlePreviewPdf}
        />
        
        {/* Conteúdo do PDF */}
        <div className="print-container">
          <QuotationContent quotation={quotationData} />
        </div>
      </div>
    </Layout>
  );
};

export default QuotationView;
