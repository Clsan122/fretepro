
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getFreightById, getClientById, getDriverById } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";
import { Freight, Client, Driver } from "@/types";
import Layout from "@/components/Layout";
import FreightFormPdf from "@/components/freight/FreightFormPdf";
import { 
  exportFreightFormPdf, 
  previewFreightFormPdf 
} from "@/utils/pdf/freightFormPdf";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Share2, Eye } from "lucide-react";

const FreightFormPdfView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [freight, setFreight] = useState<Freight | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const freightId = searchParams.get("id");
    if (!freightId) {
      toast({
        title: "Erro",
        description: "Nenhum frete selecionado para o formulário.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const freightData = getFreightById(freightId);
    if (!freightData) {
      toast({
        title: "Erro",
        description: "Frete não encontrado.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Buscar dados do cliente
    const clientData = getClientById(freightData.clientId);
    setClient(clientData);

    // Buscar dados do motorista, se existir
    if (freightData.driverId) {
      const driverData = getDriverById(freightData.driverId);
      setDriver(driverData);
    }

    setFreight(freightData);
    setLoading(false);
  }, [searchParams, user, toast]);

  const handlePreview = async () => {
    if (!freight || !user) return;
    
    toast({
      title: "Gerando pré-visualização",
      description: "Aguarde enquanto preparamos o documento...",
    });
    
    try {
      await previewFreightFormPdf('freight-form-print', freight, user);
    } catch (error) {
      console.error('Erro ao gerar pré-visualização:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a pré-visualização do documento.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!freight || !user) return;
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o download...",
    });
    
    try {
      await exportFreightFormPdf('freight-form-print', freight, user);
      toast({
        title: "Sucesso",
        description: "O PDF foi gerado e baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF para download.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!freight || !user) return;
    
    toast({
      title: "Preparando para compartilhar",
      description: "Aguarde...",
    });
    
    try {
      // Gerar o PDF primeiro
      const pdf = await generateFreightFormPdf('freight-form-print', freight, { sender: user });
      
      // Verificar se o navegador suporta compartilhamento
      if (navigator.share) {
        const clientName = client?.name || "Cliente";
        const file = new File([pdf], `frete-${clientName}.pdf`, { type: 'application/pdf' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Formulário de Frete - ${clientName}`,
            text: `Formulário de frete de ${freight.originCity}/${freight.originState} para ${freight.destinationCity}/${freight.destinationState}`,
          });
        } else {
          // Fallback para dispositivos que não suportam compartilhamento de arquivos
          const dataUrl = URL.createObjectURL(pdf);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `frete-${clientName}.pdf`;
          a.click();
          URL.revokeObjectURL(dataUrl);
        }
      } else {
        // Fallback para navegadores que não suportam Web Share API
        await handleDownload();
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o documento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 md:px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Formulário de Frete</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handlePreview}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Pré-visualizar</span>
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              onClick={handleShare}
              variant="default"
              size="sm"
              className="gap-1"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p>Carregando dados do frete...</p>
          </div>
        ) : freight && user ? (
          <div className="bg-white rounded-lg border shadow-sm print:shadow-none print:border-0">
            <FreightFormPdf 
              freight={freight}
              client={client}
              driver={driver}
              sender={user}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p>Não foi possível gerar o formulário. Verifique se o frete existe.</p>
            <Button 
              onClick={() => navigate("/freights")}
              variant="outline"
              className="mt-4"
            >
              Voltar para Fretes
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FreightFormPdfView;
