import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, FileDown, Trash2, Eye, Edit, CheckCircle, XCircle, Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuotationData } from "@/components/quotation/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { generateQuotationPdf } from "@/utils/pdfGenerator";
import { generateQuotationNumber } from "@/utils/quotationNumber";
const Quotations: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      try {
        // Load quotations from localStorage
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        // Filter quotations for current user
        const userQuotations = storedQuotations.filter((quotation: any) => quotation.userId === user.id);

        // Ensure all quotations have a valid status property and order number
        const updatedQuotations = userQuotations.map((quotation: any) => {
          // If quotation doesn't have order number, generate one
          const orderNumber = quotation.orderNumber || generateQuotationNumber();
          return {
            ...quotation,
            // Make sure the status is strictly "closed" or "open" (as required by QuotationData type)
            status: quotation.status === "closed" ? "closed" : "open",
            orderNumber
          };
        }) as QuotationData[]; // Cast to ensure TypeScript knows this is now a valid QuotationData[]

        setQuotations(updatedQuotations);

        // Update localStorage with the updated quotations
        localStorage.setItem('quotations', JSON.stringify([...storedQuotations.filter((q: any) => q.userId !== user.id), ...updatedQuotations]));
      } catch (error) {
        console.error("Error loading quotations:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as cotações",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  }, [user, toast]);
  const handleDelete = (id: string) => {
    try {
      // Filter out the quotation to be deleted
      const updatedQuotations = quotations.filter(quotation => quotation.id !== id);

      // Update localStorage
      const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
      const filteredQuotations = storedQuotations.filter((quotation: QuotationData) => quotation.id !== id);
      localStorage.setItem('quotations', JSON.stringify(filteredQuotations));

      // Update state
      setQuotations(updatedQuotations);
      toast({
        title: "Sucesso",
        description: "Cotação excluída com sucesso"
      });
    } catch (error) {
      console.error("Error deleting quotation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a cotação",
        variant: "destructive"
      });
    }
  };
  const handleToggleStatus = (id: string) => {
    try {
      // Get the quotation to update
      const quotationToUpdate = quotations.find(q => q.id === id);
      if (!quotationToUpdate) {
        return;
      }

      // Toggle the status - explicitly using the literal values accepted by our type
      const newStatus: "open" | "closed" = quotationToUpdate.status === "open" ? "closed" : "open";

      // Update in state - map to create a new array
      const updatedQuotations = quotations.map(quotation => quotation.id === id ? {
        ...quotation,
        status: newStatus
      } : quotation);
      setQuotations(updatedQuotations);

      // Update in localStorage
      const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
      const updatedStoredQuotations = storedQuotations.map((quotation: any) => quotation.id === id ? {
        ...quotation,
        status: newStatus
      } : quotation);
      localStorage.setItem('quotations', JSON.stringify(updatedStoredQuotations));
      toast({
        title: "Status atualizado",
        description: `Cotação marcada como ${newStatus === "closed" ? "fechada" : "aberta"}`
      });
    } catch (error) {
      console.error("Error updating quotation status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da cotação",
        variant: "destructive"
      });
    }
  };
  const handleGeneratePdf = (quotation: QuotationData) => {
    generateQuotationPdf(quotation.id).then(success => {
      if (success) {
        toast({
          title: "PDF gerado",
          description: "O PDF da cotação foi gerado com sucesso"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o PDF",
          variant: "destructive"
        });
      }
    }).catch(error => {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o PDF",
        variant: "destructive"
      });
    });
  };
  const handleViewQuotation = (quotationId: string) => {
    navigate(`/quotation/view/${quotationId}`);
  };
  const handleEditQuotation = (quotationId: string) => {
    navigate(`/quotation/edit/${quotationId}`);
  };
  return <Layout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="md:text-3xl font-bold text-freight-700 dark:text-freight-300 text-base">
                Cotações de Frete
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas cotações de frete
              </p>
            </div>
            <Button onClick={() => navigate("/quotation/new")} className="bg-gradient-to-r from-freight-600 to-freight-800 hover:from-freight-700 hover:to-freight-900 hover:shadow-lg transition-all text-sm px-[12px]">
              <Plus className="mr-2 h-5 w-5" /> Nova Cotação
            </Button>
          </div>
          
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
            <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
              <CardTitle className="text-freight-700 dark:text-freight-300 flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Cotações Recentes
              </CardTitle>
              <CardDescription>
                Visualize e gerencie suas cotações de frete
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-6 text-center">
                  <p>Carregando cotações...</p>
                </div> : quotations.length === 0 ? <div className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhuma cotação encontrada</p>
                  <Button onClick={() => navigate("/quotation/new")} variant="outline" className="mt-4 hover:bg-freight-50 dark:hover:bg-freight-900">
                    <Plus className="mr-2 h-4 w-4" /> Criar Primeira Cotação
                  </Button>
                </div> : <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Criador</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.map(quotation => <TableRow key={quotation.id} className="hover:bg-freight-50/70 dark:hover:bg-freight-900/30 transition-colors">
                          <TableCell className="font-medium">{quotation.orderNumber || '-'}</TableCell>
                          <TableCell>{quotation.creatorName}</TableCell>
                          <TableCell>{`${quotation.originCity}/${quotation.originState}`}</TableCell>
                          <TableCell>{`${quotation.destinationCity}/${quotation.destinationState}`}</TableCell>
                          <TableCell>{formatCurrency(quotation.totalValue)}</TableCell>
                          <TableCell>
                            <Badge variant={quotation.status === "closed" ? "default" : "outline"} className={quotation.status === "closed" ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"}>
                              {quotation.status === "closed" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                              {quotation.status === "closed" ? "Fechada" : "Aberta"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(quotation.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-freight-700 hover:bg-freight-100 dark:text-freight-300 dark:hover:bg-freight-800" onClick={() => handleViewQuotation(quotation.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-freight-700 hover:bg-freight-100 dark:text-freight-300 dark:hover:bg-freight-800" onClick={() => handleEditQuotation(quotation.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-freight-700 hover:bg-freight-100 dark:text-freight-300 dark:hover:bg-freight-800" onClick={() => handleGeneratePdf(quotation)}>
                                <FileDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className={`h-8 w-8 ${quotation.status === "closed" ? "text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30" : "text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"}`} onClick={() => handleToggleStatus(quotation.id)} title={quotation.status === "closed" ? "Reabrir cotação" : "Fechar cotação"}>
                                {quotation.status === "closed" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(quotation.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>;
};
export default Quotations;