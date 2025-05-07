
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Plus, FileDown, Trash2, Eye } from "lucide-react";

interface QuotationData {
  id: string;
  orderNumber?: string;
  creatorId: string;
  creatorName: string;
  creatorLogo?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  totalValue: number;
  createdAt: string;
  userId: string;
}

const Quotations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  useEffect(() => {
    if (user) {
      try {
        // Load quotations from localStorage
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        // Filter quotations for current user
        const userQuotations = storedQuotations.filter(
          (quotation: QuotationData) => quotation.userId === user.id
        );
        setQuotations(userQuotations);
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
      const filteredQuotations = storedQuotations.filter(
        (quotation: QuotationData) => quotation.id !== id
      );
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
  
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-freight-700 dark:text-freight-300">
                Cotações de Frete
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas cotações de frete
              </p>
            </div>
            <Button
              onClick={() => navigate("/quotation/new")}
              className="bg-gradient-to-r from-freight-600 to-freight-800 hover:from-freight-700 hover:to-freight-900 hover:shadow-lg transition-all"
            >
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
              {loading ? (
                <div className="p-6 text-center">
                  <p>Carregando cotações...</p>
                </div>
              ) : quotations.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhuma cotação encontrada</p>
                  <Button
                    onClick={() => navigate("/quotation/new")}
                    variant="outline"
                    className="mt-4 hover:bg-freight-50 dark:hover:bg-freight-900"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Criar Primeira Cotação
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Criador</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.map((quotation) => (
                        <TableRow 
                          key={quotation.id}
                          className="hover:bg-freight-50/70 dark:hover:bg-freight-900/30 transition-colors"
                        >
                          <TableCell className="font-medium">{quotation.orderNumber || '-'}</TableCell>
                          <TableCell>{quotation.creatorName}</TableCell>
                          <TableCell>{`${quotation.originCity}/${quotation.originState}`}</TableCell>
                          <TableCell>{`${quotation.destinationCity}/${quotation.destinationState}`}</TableCell>
                          <TableCell>{formatCurrency(quotation.totalValue)}</TableCell>
                          <TableCell>{formatDate(quotation.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-freight-700 hover:bg-freight-100 dark:text-freight-300 dark:hover:bg-freight-800"
                                onClick={() => {
                                  toast({
                                    title: "Visualizar",
                                    description: "Funcionalidade em desenvolvimento"
                                  });
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-freight-700 hover:bg-freight-100 dark:text-freight-300 dark:hover:bg-freight-800"
                                onClick={() => {
                                  toast({
                                    title: "PDF",
                                    description: "Funcionalidade em desenvolvimento"
                                  });
                                }}
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(quotation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Quotations;
