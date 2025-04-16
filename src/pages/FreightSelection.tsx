import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getFreightsByUserId, getClientById } from "@/utils/storage";
import { Freight } from "@/types";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, FileText, Truck, CheckSquare, ArrowLeft } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createMultiFreightReceiptUrl } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";

type FilterPeriod = "day" | "week" | "month" | "custom";

const FreightSelection: React.FC = () => {
  const { user } = useAuth();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [selectedFreights, setSelectedFreights] = useState<string[]>([]);
  const [period, setPeriod] = useState<FilterPeriod>("day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(),
    to: new Date()
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      setFreights(userFreights);
    }
  }, [user]);

  useEffect(() => {
    if (freights.length === 0) return;

    let start: Date;
    let end: Date;

    switch (period) {
      case "day":
        start = startOfDay(selectedDate);
        end = endOfDay(selectedDate);
        break;
      case "week":
        start = startOfWeek(selectedDate, { weekStartsOn: 0 });
        end = endOfWeek(selectedDate, { weekStartsOn: 0 });
        break;
      case "month":
        start = startOfMonth(selectedDate);
        end = endOfMonth(selectedDate);
        break;
      case "custom":
        start = startOfDay(customDateRange.from);
        end = customDateRange.to 
          ? endOfDay(customDateRange.to) 
          : endOfDay(customDateRange.from);
        break;
      default:
        start = startOfDay(selectedDate);
        end = endOfDay(selectedDate);
    }

    const filtered = freights.filter(freight => {
      const freightDate = parseISO(freight.createdAt);
      return isWithinInterval(freightDate, { start, end });
    });

    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredFreights(filtered);
    setSelectedFreights([]);
  }, [freights, period, selectedDate, customDateRange]);

  const handleFreightSelect = (freightId: string) => {
    setSelectedFreights(prev => {
      if (prev.includes(freightId)) {
        return prev.filter(id => id !== freightId);
      } else {
        return [...prev, freightId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedFreights.length === filteredFreights.length) {
      setSelectedFreights([]);
    } else {
      setSelectedFreights(filteredFreights.map(f => f.id));
    }
  };

  const handleGenerateReceipt = () => {
    if (selectedFreights.length === 0) {
      toast({
        title: "Nenhum frete selecionado",
        description: "Selecione pelo menos um frete para gerar o recibo.",
        variant: "destructive",
      });
      return;
    }

    const url = createMultiFreightReceiptUrl(selectedFreights);
    navigate(url);
  };

  const renderDateLabel = () => {
    switch (period) {
      case "day":
        return format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      case "week":
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
        return `${format(weekStart, "dd/MM")} a ${format(weekEnd, "dd/MM/yyyy")}`;
      case "month":
        return format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
      case "custom":
        if (customDateRange.to) {
          return `${format(customDateRange.from, "dd/MM")} a ${format(customDateRange.to, "dd/MM/yyyy")}`;
        }
        return format(customDateRange.from, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      default:
        return "";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 md:px-4 max-w-full overflow-x-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Selecionar Fretes para Recibo</h1>
          
          <Button
            onClick={() => navigate("/freights")}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Fretes
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtrar por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={period} onValueChange={(value: FilterPeriod) => setPeriod(value)}>
                <SelectTrigger className="w-[140px] md:w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>

              {period !== "custom" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal max-w-[220px] truncate",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {selectedDate ? renderDateLabel() : "Selecione a data"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal max-w-[220px] truncate",
                        !customDateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {customDateRange?.from ? (
                          customDateRange.to ? (
                            <>
                              {format(customDateRange.from, "dd/MM/yyyy")} -{" "}
                              {format(customDateRange.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(customDateRange.from, "dd/MM/yyyy")
                          )
                        ) : (
                          "Selecione período personalizado"
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={customDateRange}
                      onSelect={setCustomDateRange}
                      numberOfMonths={1}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              <Button onClick={handleSelectAll} variant="outline" size="sm" className="gap-2 ml-auto">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {selectedFreights.length === filteredFreights.length && filteredFreights.length > 0 
                    ? "Desmarcar Todos" 
                    : "Selecionar Todos"}
                </span>
                <span className="sm:hidden">
                  {selectedFreights.length === filteredFreights.length && filteredFreights.length > 0 
                    ? "Desmarcar" 
                    : "Selecionar"}
                </span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredFreights.length} fretes encontrados
            </p>
            <Button 
              onClick={handleGenerateReceipt} 
              disabled={selectedFreights.length === 0}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Gerar Recibo</span>
              <span className="sm:hidden">Recibo</span>
              {selectedFreights.length > 0 && <span>({selectedFreights.length})</span>}
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFreights.map(freight => {
            const client = getClientById(freight.clientId);
            const isSelected = selectedFreights.includes(freight.id);
            
            return (
              <Card 
                key={freight.id}
                className={cn(
                  "border-2",
                  isSelected ? "border-primary" : "border-transparent"
                )}
              >
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="truncate mr-2">
                    <CardTitle className="text-base truncate">{client?.name || "Cliente não encontrado"}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(freight.createdAt), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleFreightSelect(freight.id)}
                    className="flex-shrink-0"
                  />
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs truncate">
                      {freight.originCity}/{freight.originState} → {freight.destinationCity}/{freight.destinationState}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span>Valor:</span>
                      <span className="font-medium">R$ {freight.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleFreightSelect(freight.id)}
                    className="w-full text-xs"
                  >
                    {isSelected ? "Remover" : "Selecionar"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          
          {filteredFreights.length === 0 && (
            <div className="col-span-full text-center p-6 bg-gray-50 rounded-lg">
              <p>Nenhum frete encontrado no período selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FreightSelection;
