
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { QuotationData } from "@/components/quotation/types";
import {
  Card,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from "date-fns";
import { FileText, ArrowUpRight } from "lucide-react";
import { ptBR } from "date-fns/locale";

interface ClosedQuotationsReportProps {
  startDate: Date;
  endDate: Date;
}

export const ClosedQuotationsReport: React.FC<ClosedQuotationsReportProps> = ({ startDate, endDate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [closedQuotations, setClosedQuotations] = useState<QuotationData[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (user) {
      try {
        // Carregar cotações do localStorage
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        
        // Filtrar cotações do usuário atual
        const userQuotations: QuotationData[] = storedQuotations.filter(
          (quotation: QuotationData) => quotation.userId === user.id && quotation.status === "closed"
        );

        // Filtrar pelo período selecionado
        const filteredQuotations = userQuotations.filter(quotation => {
          const quotationDate = parseISO(quotation.createdAt);
          return isWithinInterval(quotationDate, { start: startDate, end: endDate });
        });
        
        // Ordenar por data de criação (mais recentes primeiro)
        const sortedQuotations = filteredQuotations.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Calcular valor total
        const total = filteredQuotations.reduce((sum, q) => sum + q.totalValue, 0);
        
        setClosedQuotations(sortedQuotations);
        setTotalValue(total);
      } catch (error) {
        console.error("Erro ao carregar estatísticas de cotações:", error);
      }
    }
  }, [user, startDate, endDate]);

  const handleViewQuotation = (id: string) => {
    navigate(`/quotation/view/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium flex items-center">
          <FileText className="mr-2 h-5 w-5 text-freight-600" />
          Cotações Fechadas - {format(startDate, "dd/MM/yyyy")} a {format(endDate, "dd/MM/yyyy")}
        </h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/quotations')}
        >
          Ver Todas
        </Button>
      </div>
      
      <Card className="border-freight-100 dark:border-freight-800">
        <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
          <CardTitle className="text-freight-700 dark:text-freight-300 text-lg">
            Resumo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="text-sm text-muted-foreground">Total de Cotações Fechadas</div>
              <div className="text-2xl font-bold mt-1">{closedQuotations.length}</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {formatCurrency(totalValue)}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="text-sm text-muted-foreground">Valor Médio</div>
              <div className="text-2xl font-bold mt-1">
                {closedQuotations.length > 0
                  ? formatCurrency(totalValue / closedQuotations.length)
                  : formatCurrency(0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cotações Fechadas no Período</CardTitle>
        </CardHeader>
        <CardContent>
          {closedQuotations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nº Cotação</TableHead>
                  <TableHead>Origem-Destino</TableHead>
                  <TableHead>Tipo de Carga</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closedQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell>
                      {format(new Date(quotation.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {quotation.orderNumber || "-"}
                    </TableCell>
                    <TableCell>
                      {`${quotation.originCity}/${quotation.originState} - ${quotation.destinationCity}/${quotation.destinationState}`}
                    </TableCell>
                    <TableCell>{quotation.cargoType}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(quotation.totalValue)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewQuotation(quotation.id)}
                        className="h-8 w-8 p-0"
                      >
                        <span className="sr-only">Ver detalhes</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
              <p className="text-muted-foreground">
                Nenhuma cotação fechada encontrada para o período selecionado
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/quotations/new")}
                className="mt-4"
              >
                Criar Nova Cotação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
