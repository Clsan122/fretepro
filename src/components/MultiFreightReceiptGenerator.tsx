
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Freight } from "@/types";
import { getUser } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { PrinterIcon, Save, FileText } from "lucide-react";
import { groupFreightsByClient, getTotalAmount, getDateRangeText } from "@/utils/receipt-helpers";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import PrintStyles from "./multi-freight-receipt/PrintStyles";
import ReceiptHeader from "./multi-freight-receipt/ReceiptHeader";
import ClientDetailsSection from "./multi-freight-receipt/ClientDetailsSection";
import ReceiptFooter from "./multi-freight-receipt/ReceiptFooter";
import SummaryTable from "./multi-freight-receipt/SummaryTable";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MultiFreightReceiptGeneratorProps {
  freights: Freight[];
}

const MultiFreightReceiptGenerator: React.FC<MultiFreightReceiptGeneratorProps> = ({ freights }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const currentUser = getUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [requesterName, setRequesterName] = useState<string>(currentUser?.name || "");
  const [pixKey, setPixKey] = useState<string>(currentUser?.pixKey || "");
  const [paymentTerm, setPaymentTerm] = useState<string>("30 dias");
  const [useProfileData, setUseProfileData] = useState(Boolean(currentUser?.name || currentUser?.pixKey));
  
  const dateRangeText = getDateRangeText(freights);
  const totalAmount = getTotalAmount(freights);
  const freightsByClient = groupFreightsByClient(freights);
  
  const paymentTermOptions = [
    { value: "À vista", label: "À vista" },
    { value: "Por semana", label: "Por semana" },
    { value: "7 dias", label: "7 dias" },
    { value: "10 dias", label: "10 dias" },
    { value: "12 dias", label: "12 dias" },
    { value: "15 dias", label: "15 dias" },
    { value: "20 dias", label: "20 dias" },
    { value: "25 dias", label: "25 dias" },
    { value: "30 dias", label: "30 dias" },
    { value: "custom", label: "Outro" },
  ];

  const handleUseProfileData = (checked: boolean) => {
    setUseProfileData(checked);
    if (checked && currentUser) {
      if (currentUser.pixKey) setPixKey(currentUser.pixKey);
      if (currentUser.name) setRequesterName(currentUser.name);
    } else {
      setPixKey("");
      setRequesterName("");
    }
  };

  const handleSave = () => {
    // Save the receipt data to localStorage
    try {
      const receiptData = {
        freights,
        dateGenerated: new Date().toISOString(),
        totalAmount,
        dateRangeText,
        requesterName,
        pixKey,
        paymentTerm
      };

      // Get existing receipts or initialize empty array
      const existingReceipts = JSON.parse(localStorage.getItem('multiFreightReceipts') || '[]');
      existingReceipts.push(receiptData);
      localStorage.setItem('multiFreightReceipts', JSON.stringify(existingReceipts));

      toast({
        title: "Recibo salvo",
        description: "O recibo foi salvo com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao salvar recibo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o recibo",
        variant: "destructive"
      });
    }
  };

  // Fix the useReactToPrint hook configuration to use the proper type
  const handlePrint = useReactToPrint({
    documentTitle: "Recibo de Múltiplos Fretes",
    onAfterPrint: () => console.log("Impressão concluída!"),
    pageStyle: "@page { size: A4; margin: 10mm; }",
    content: () => componentRef.current,
  });

  const handleGeneratePDF = async () => {
    if (!componentRef.current) return;
    
    setIsGenerating(true);
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o documento..."
    });
    
    try {
      const contentElement = componentRef.current;
      const originalWidth = contentElement.style.width;
      contentElement.style.width = '800px';
      
      // Adicionar classe temporária para melhorar a renderização para PDF
      contentElement.classList.add('pdf-generation-mode');
      
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 800,
        backgroundColor: '#FFFFFF'
      });
      
      // Restaurar o elemento ao estado original
      contentElement.style.width = originalWidth;
      contentElement.classList.remove('pdf-generation-mode');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular proporções para ajustar à página
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Salvar o PDF
      pdf.save(`recibo-fretes-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi salvo com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <div className="mb-4 space-y-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Informações de Pagamento</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Usar dados do perfil</span>
              <Switch
                checked={useProfileData}
                onCheckedChange={handleUseProfileData}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requester-name" className="text-sm">Nome do Solicitante</Label>
              <Input 
                id="requester-name"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Informe quem está solicitando o recibo"
                className="w-full"
                disabled={useProfileData}
              />
            </div>
            <div>
              <Label htmlFor="pix-key" className="text-sm">Chave PIX</Label>
              <Input 
                id="pix-key"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Informe a chave PIX"
                className="w-full"
                disabled={useProfileData}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="payment-term" className="text-sm">Prazo de Pagamento</Label>
            <Select 
              value={paymentTerm} 
              onValueChange={setPaymentTerm}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o prazo de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {paymentTermOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {paymentTerm === "custom" && (
              <Input
                className="mt-2"
                placeholder="Especifique o prazo de pagamento"
                value={paymentTerm === "custom" ? "" : paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
              />
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-2 w-full justify-end">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handlePrint}
          >
            <PrinterIcon className="h-4 w-4" />
            Imprimir
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4" />
            {isGenerating ? "Gerando..." : "Salvar PDF"}
          </Button>
        </div>
      </div>

      <div 
        ref={componentRef} 
        className={`bg-white p-4 mx-auto max-w-full shadow-sm print:shadow-none print:p-0 print-container ${isGenerating ? 'opacity-0 absolute' : ''}`}
        style={{ width: '100%' }}
      >
        <PrintStyles />
        <ReceiptHeader dateRangeText={dateRangeText} currentUser={currentUser} />
        <ClientDetailsSection freightsByClient={freightsByClient} />
        <SummaryTable freights={freights} />
        <ReceiptFooter 
          totalAmount={totalAmount} 
          currentUser={currentUser}
          requesterName={requesterName}
          paymentTerm={paymentTerm}
        />
      </div>
    </div>
  );
};

export default MultiFreightReceiptGenerator;
