
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { QuotationData } from "@/components/quotation/types";
import { CheckCircle, XCircle, FileText, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

interface QuotationsStats {
  total: number;
  open: number;
  closed: number;
  totalValue: number;
  closedValue: number;
  openValue: number;
}

export const QuotationsSummary: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotationStats, setQuotationStats] = useState<QuotationsStats>({
    total: 0,
    open: 0,
    closed: 0,
    totalValue: 0,
    closedValue: 0,
    openValue: 0,
  });

  useEffect(() => {
    if (user) {
      try {
        // Carregar cotações do localStorage
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        
        // Filtrar cotações do usuário atual
        const userQuotations: QuotationData[] = storedQuotations.filter(
          (quotation: QuotationData) => quotation.userId === user.id
        );

        // Calcular estatísticas gerais para todas as cotações
        const stats: QuotationsStats = userQuotations.reduce((acc: QuotationsStats, quotation) => {
          const isOpen = quotation.status === "open";
          
          return {
            total: acc.total + 1,
            open: isOpen ? acc.open + 1 : acc.open,
            closed: isOpen ? acc.closed : acc.closed + 1,
            totalValue: acc.totalValue + quotation.totalValue,
            openValue: isOpen ? acc.openValue + quotation.totalValue : acc.openValue,
            closedValue: isOpen ? acc.closedValue : acc.closedValue + quotation.totalValue,
          };
        }, {
          total: 0,
          open: 0,
          closed: 0,
          totalValue: 0,
          openValue: 0,
          closedValue: 0,
        });
        
        setQuotationStats(stats);
      } catch (error) {
        console.error("Erro ao carregar estatísticas de cotações:", error);
      }
    }
  }, [user]);

  // Dados para o gráfico de status
  const statusData = [
    { name: "Abertas", value: quotationStats.open, color: "#f87171" },
    { name: "Fechadas", value: quotationStats.closed, color: "#4ade80" }
  ];

  const closedPercentage = quotationStats.total > 0 
    ? Math.round((quotationStats.closed / quotationStats.total) * 100)
    : 0;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
      <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50 p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-freight-700 dark:text-freight-300 flex items-center text-base sm:text-lg">
            <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Cotações
          </CardTitle>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 w-7 sm:h-8 sm:w-8 p-0" 
            onClick={() => navigate('/quotations')}
          >
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Ver todas</span>
          </Button>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Análise das suas cotações de frete
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-2 sm:p-4 rounded-lg">
                <div className="font-medium text-green-800 dark:text-green-300 flex items-center text-xs sm:text-sm">
                  <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Fechadas
                </div>
                <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                  {quotationStats.closed}
                </div>
                <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-green-700 dark:text-green-400">
                  {formatCurrency(quotationStats.closedValue)}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-2 sm:p-4 rounded-lg">
                <div className="font-medium text-red-800 dark:text-red-300 flex items-center text-xs sm:text-sm">
                  <XCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Abertas
                </div>
                <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-red-800 dark:text-red-300">
                  {quotationStats.open}
                </div>
                <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-700 dark:text-red-400">
                  {formatCurrency(quotationStats.openValue)}
                </div>
              </div>
            </div>
            
            <div className="bg-freight-50/50 dark:bg-freight-900/50 p-2 sm:p-4 rounded-lg">
              <div className="font-medium text-freight-800 dark:text-freight-300 text-xs sm:text-sm">
                Taxa de Fechamento
              </div>
              <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-freight-800 dark:text-freight-300">
                {closedPercentage}%
              </div>
              <div className="mt-0.5 sm:mt-1 text-xs text-freight-700 dark:text-freight-400">
                {quotationStats.closed} de {quotationStats.total} cotações
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-freight-600 to-freight-800 hover:from-freight-700 hover:to-freight-900 text-xs sm:text-sm py-1.5 sm:py-2"
              onClick={() => navigate("/quotations")}
            >
              Ver Todas as Cotações
            </Button>
          </div>
          
          <div className="h-[200px] sm:h-[300px] flex items-center justify-center">
            {quotationStats.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={quotationStats.total > 5 ? 50 : 30}
                    outerRadius={quotationStats.total > 5 ? 70 : 50}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} cotações`, 'Quantidade']} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                <p>Não há dados de cotações para exibir</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
