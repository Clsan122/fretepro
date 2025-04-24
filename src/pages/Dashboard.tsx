import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getFreightsByUserId, getClientsByUserId } from "@/utils/storage";
import { Freight, Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Package, Users, DollarSign, TrendingUp, BarChart2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => {
    if (freights.length > 0) {
      let filtered = [...freights];
      
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      filtered = filtered.filter(freight => {
        const freightDate = parseISO(freight.createdAt);
        return isWithinInterval(freightDate, { start: monthStart, end: monthEnd });
      });
      
      if (selectedClient !== "all") {
        filtered = filtered.filter(freight => freight.clientId === selectedClient);
      }
      
      setFilteredFreights(filtered);
    }
  }, [freights, selectedMonth, selectedClient]);

  const revenueChartData = filteredFreights.map(freight => ({
    date: format(new Date(freight.createdAt), "dd/MM"),
    valor: freight.totalValue
  }));

  const profitChartData = filteredFreights.map(freight => ({
    date: format(new Date(freight.createdAt), "dd/MM"),
    "Receita Bruta": freight.totalValue,
    "Despesas": freight.totalExpenses || 0,
    "Lucro Líquido": (freight.netProfit !== undefined) ? freight.netProfit : (freight.totalValue - (freight.totalExpenses || 0))
  }));

  const totalFreights = filteredFreights.length;
  const totalRevenue = filteredFreights.reduce((sum, freight) => sum + freight.totalValue, 0);
  
  const totalExpenses = filteredFreights.reduce((sum, freight) => {
    if (freight.totalExpenses !== undefined) {
      return sum + freight.totalExpenses;
    } else {
      return sum + freight.dailyRate + freight.otherCosts + freight.tollCosts;
    }
  }, 0);
  
  const totalProfit = filteredFreights.reduce((sum, freight) => {
    if (freight.netProfit !== undefined) {
      return sum + freight.netProfit;
    } else {
      const expenses = freight.totalExpenses || (freight.dailyRate + freight.otherCosts + freight.tollCosts);
      return sum + (freight.totalValue - expenses);
    }
  }, 0);

  const expenseBreakdown = {
    thirdPartyDriver: filteredFreights.reduce((sum, f) => sum + (f.thirdPartyDriverCost || 0), 0),
    toll: filteredFreights.reduce((sum, f) => sum + (f.tollExpenses || 0), 0),
    fuel: filteredFreights.reduce((sum, f) => sum + (f.fuelExpenses || 0), 0),
    meals: filteredFreights.reduce((sum, f) => sum + (f.mealExpenses || 0), 0),
    helpers: filteredFreights.reduce((sum, f) => sum + (f.helperExpenses || 0), 0),
    accommodation: filteredFreights.reduce((sum, f) => sum + (f.accommodationExpenses || 0), 0),
    other: filteredFreights.reduce((sum, f) => {
      if (f.totalExpenses === undefined) {
        return sum + f.dailyRate + f.otherCosts + f.tollCosts;
      }
      return sum;
    }, 0)
  };

  return (
    <Layout>
      <div className="min-h-screen w-full">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <Label htmlFor="month-select" className="sr-only">Mês</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="month-select"
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !selectedMonth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedMonth ? (
                        format(selectedMonth, "MMMM yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione o mês</span>
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
                  <SelectTrigger id="client-select" className="min-w-[180px]">
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

          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="profit">Relatório de Lucro</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fretes no Período</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalFreights}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de fretes no mês selecionado
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Receita dos fretes no período
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Custos</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {totalExpenses.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Custos associados aos fretes
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {totalProfit.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Lucro total do período
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Receita por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {revenueChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueChartData}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
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
                        <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profit" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
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
                    <div className="text-2xl font-bold text-red-500">R$ {totalExpenses.toFixed(2)}</div>
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
                      R$ {totalProfit.toFixed(2)}
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
                              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
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
                        <span>R$ {expenseBreakdown.thirdPartyDriver.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Pedágio:</span>
                        <span>R$ {expenseBreakdown.toll.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Abastecimento:</span>
                        <span>R$ {expenseBreakdown.fuel.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Refeição:</span>
                        <span>R$ {expenseBreakdown.meals.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Ajudante:</span>
                        <span>R$ {expenseBreakdown.helpers.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Hotel/Pousada:</span>
                        <span>R$ {expenseBreakdown.accommodation.toFixed(2)}</span>
                      </div>
                      
                      {expenseBreakdown.other > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Outros (fretes antigos):</span>
                          <span>R$ {expenseBreakdown.other.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="pt-2 mt-2 border-t flex justify-between items-center font-medium">
                        <span>Total:</span>
                        <span>R$ {totalExpenses.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
