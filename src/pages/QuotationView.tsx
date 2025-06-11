
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
    // Use existing fields or provide defaults
    cargoWeight: quotation.weight || 0,
    cubicMeasurement: quotation.cubicMeasurement || 1,
    measurements: quotation.measurements || [],
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
