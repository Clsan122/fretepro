
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import QuotationViewActions from "@/components/quotation/view/QuotationViewActions";
import QuotationContent from "@/components/quotation/view/QuotationContent";
import QuotationLoading from "@/components/quotation/view/QuotationLoading";
import { useQuotationView } from "@/hooks/quotation/useQuotationView";

const QuotationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    quotation,
    loading,
    sending,
    generating,
    sharing,
    handleSharePdf,
    handleSendQuotation,
    handleEdit
  } = useQuotationView(id);
  
  if (loading || !quotation) {
    return <QuotationLoading isLoading={loading} notFound={!loading && !quotation} />;
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto pb-20 md:pb-10">
        <QuotationViewActions 
          id={id!}
          sending={sending}
          generating={generating}
          sharing={sharing}
          handleSharePdf={handleSharePdf}
          handleSendQuotation={handleSendQuotation}
          handleEdit={handleEdit}
        />
        
        {/* Conteúdo do PDF */}
        <QuotationContent quotation={quotation} />
      </div>
    </Layout>
  );
};

export default QuotationView;
