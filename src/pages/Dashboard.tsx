
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getFreightsByUserId, getClientsByUserId } from "@/utils/storage";
import { Freight, Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Package, Users, DollarSign, TrendingUp, BarChart2, Truck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/formatters";
import { QuotationsSummary } from "@/components/dashboard/QuotationsSummary";
import { ClosedQuotationsReport } from "@/components/dashboard/ClosedQuotationsReport";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      const userClients = getClientsByUserId(user.id);
      setFreights(userFreights);
      setClients(userClients);
    }
  }, [user]);

  // Filter freights by month and client
  useEffect(() => {
    if (freights.length > 0) {
      let filtered = [...freights];
      
      // Filter by month
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      filtered = filtered.filter(freight => {
        const freightDate = parseISO(freight.createdAt);
        return isWithinInterval(freightDate, { start: monthStart, end: monthEnd });
      });
      
      // Filter by client
      if (selectedClient !== "all") {
        filtered = filtered.filter(freight => freight.clientId === selectedClient);
      }
      
      setFilteredFreights(filtered);
    }
  }, [freights, selectedMonth, selectedClient]);

  // Prepare chart data
  const revenueChartData = filteredFreights.map(freight => ({
    date: format(new Date(freight.createdAt), "dd/MM"),
    valor: freight.totalValue
  }));

  // Prepare profit chart data
  const profitChartData = filteredFreights.map(freight => ({
    date: format(new Date(freight.createdAt), "dd/MM"),
    "Receita Bruta": freight.totalValue,
    "Despesas": freight.totalExpenses || 0,
    "Lucro Líquido": (freight.netProfit !== undefined) ? freight.netProfit : (freight.totalValue - (freight.totalExpenses || 0))
  }));

  // Calculate statistics
  const totalFreights = filteredFreights.length;
  const totalRevenue = filteredFreights.reduce((sum, freight) => sum + freight.totalValue, 0);
  
  // Calculate total expenses - accounting for both old and new freight records
  const totalExpenses = filteredFreights.reduce((sum, freight) => {
    if (freight.totalExpenses !== undefined) {
      return sum + freight.totalExpenses;
    } else {
      return sum + freight.dailyRate + freight.otherCosts + freight.tollCosts;
    }
  }, 0);
  
  // Calculate net profit - accounting for both old and new freight records
  const totalProfit = filteredFreights.reduce((sum, freight) => {
    if (freight.netProfit !== undefined) {
      return sum + freight.netProfit;
    } else {
      const expenses = freight.totalExpenses || (freight.dailyRate + freight.otherCosts + freight.tollCosts);
      return sum + (freight.totalValue - expenses);
    }
  }, 0);

  // Detailed expense breakdown
  const expenseBreakdown = {
    thirdPartyDriver: filteredFreights.reduce((sum, f) => sum + (f.thirdPartyDriverCost || 0), 0),
    toll: filteredFreights.reduce((sum, f) => sum + (f.tollExpenses || 0), 0),
    fuel: filteredFreights.reduce((sum, f) => sum + (f.fuelExpenses || 0), 0),
    meals: filteredFreights.reduce((sum, f) => sum + (f.mealExpenses || 0), 0),
    helpers: filteredFreights.reduce((sum, f) => sum + (f.helperExpenses || 0), 0),
    accommodation: filteredFreights.reduce((sum, f) => sum + (f.accommodationExpenses || 0), 0),
    other: filteredFreights.reduce((sum, f) => {
      // For old freight records that don't have detailed expenses
      if (f.totalExpenses === undefined) {
        return sum + f.dailyRate + f.otherCosts + f.tollCosts;
      }
      return sum;
    }, 0)
  };

  return (
    <Layout>
      <div className="p-3 lg:p-6 space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
            
            <div className="flex flex-col gap-2 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <Label htmlFor="month-select" className="sr-only">Mês</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="month-select"
                      variant={"outline"}
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal flex-1 sm:flex-none",
                        !selectedMonth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedMonth ? (
                        format(selectedMonth, "MMM yyyy", { locale: ptBR })
                      ) : (
                        <span>Mês</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={selectedMonth}
                      onSelect={setSelectedMonth}
                      initialFocus
                      month={selectedMonth}
                      onMonthChange={setSelectedMonth}
                      ISOWeek={true}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="client-select" className="sr-only">Cliente</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger id="client-select" className="flex-1 sm:min-w-[180px]">
                    <SelectValue placeholder="Todos os clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os clientes</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Visão Geral</TabsTrigger>
            <TabsTrigger value="profit" className="text-xs sm:text-sm">Relatório</TabsTrigger>
            <TabsTrigger value="quotations" className="text-xs sm:text-sm">Cotações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
                  <CardTitle className="text-xs font-medium">Fretes</CardTitle>
                  <Package className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-lg font-bold">{totalFreights}</div>
                  <p className="text-[10px] text-muted-foreground">
                    No período
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
                  <CardTitle className="text-xs font-medium">Receita</CardTitle>
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-lg font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-[10px] text-muted-foreground">
                    Total
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
                  <CardTitle className="text-xs font-medium">Custos</CardTitle>
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-lg font-bold">{formatCurrency(totalExpenses)}</div>
                  <p className="text-[10px] text-muted-foreground">
                    Despesas
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
                  <CardTitle className="text-xs font-medium">Lucro</CardTitle>
                  <Users className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-lg font-bold">{formatCurrency(totalProfit)}</div>
                  <p className="text-[10px] text-muted-foreground">
                    Líquido
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Receita por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] md:h-[300px]">
                    {revenueChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueChartData}>
                          <XAxis dataKey="date" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip
                            formatter={(value: number) => [formatCurrency(value), 'Valor']}
                            labelFormatter={(label) => `Data: ${label}`}
                          />
                          <Bar 
                            dataKey="valor" 
                            fill="#0077c8" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm text-center">Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <QuotationsSummary />
            </div>
          </TabsContent>

          <TabsContent value="profit" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Valores brutos dos fretes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground">
                    Soma de todas as despesas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(totalProfit)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lucro após todas as despesas
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Relatório de Lucro por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {profitChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitChartData}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number) => [formatCurrency(value), '']}
                            labelFormatter={(label) => `Data: ${label}`}
                          />
                          <Bar dataKey="Receita Bruta" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Lucro Líquido" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento de Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Motorista Terceiro:</span>
                      <span>{formatCurrency(expenseBreakdown.thirdPartyDriver)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Pedágio:</span>
                      <span>{formatCurrency(expenseBreakdown.toll)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Abastecimento:</span>
                      <span>{formatCurrency(expenseBreakdown.fuel)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Refeição:</span>
                      <span>{formatCurrency(expenseBreakdown.meals)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Ajudante:</span>
                      <span>{formatCurrency(expenseBreakdown.helpers)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Hotel/Pousada:</span>
                      <span>{formatCurrency(expenseBreakdown.accommodation)}</span>
                    </div>
                    
                    {expenseBreakdown.other > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Outros (fretes antigos):</span>
                        <span>{formatCurrency(expenseBreakdown.other)}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 mt-2 border-t flex justify-between items-center font-medium">
                      <span>Total:</span>
                      <span>{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quotations" className="space-y-4">
            <ClosedQuotationsReport month={selectedMonth} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
