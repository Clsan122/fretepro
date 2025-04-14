
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { getFreightsByUserId, getClientsByUserId } from "@/utils/storage";
import { Freight, Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Package, Users, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  
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
  const chartData = filteredFreights.map(freight => ({
    date: format(new Date(freight.createdAt), "dd/MM"),
    valor: freight.totalValue
  }));

  // Calculate statistics
  const totalFreights = filteredFreights.length;
  const totalRevenue = filteredFreights.reduce((sum, freight) => sum + freight.freightValue, 0);
  const totalCosts = filteredFreights.reduce(
    (sum, freight) => sum + freight.dailyRate + freight.otherCosts + freight.tollCosts, 
    0
  );
  const totalProfit = totalRevenue - totalCosts;

  return (
    <Layout>
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
              <div className="text-2xl font-bold">R$ {totalCosts.toFixed(2)}</div>
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
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
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
      </div>
    </Layout>
  );
};

export default Dashboard;
