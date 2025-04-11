import React from "react";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RouteProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
  departureDate: Date | undefined;
  setDepartureDate: (value: Date | undefined) => void;
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
  arrivalDate: Date | undefined;
  setArrivalDate: (value: Date | undefined) => void;
}

export const RouteSection: React.FC<RouteProps> = ({
  originCity,
  setOriginCity,
  originState,
  setOriginState,
  departureDate,
  setDepartureDate,
  destinationCity,
  setDestinationCity,
  destinationState,
  setDestinationState,
  arrivalDate,
  setArrivalDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Origem e Destino</CardTitle>
        <CardDescription>Informe os dados da rota</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originCity">Cidade de Origem</Label>
              <Input
                id="originCity"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="Cidade de origem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originState">Estado de Origem</Label>
              <Select
                value={originState}
                onValueChange={(value) => setOriginState(value)}
              >
                <SelectTrigger id="originState">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={`origin-${state.abbreviation}`} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureDate">Data de Saída</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !departureDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                  formatters={{
                    formatCaption: (date) => format(date, "MMMM yyyy", { locale: pt }),
                    formatDay: (date) => format(date, "d", { locale: pt })
                  }}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Cidade de Destino</Label>
              <Input
                id="destinationCity"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="Cidade de destino"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationState">Estado de Destino</Label>
              <Select
                value={destinationState}
                onValueChange={(value) => setDestinationState(value)}
              >
                <SelectTrigger id="destinationState">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={`dest-${state.abbreviation}`} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalDate">Data de Chegada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !arrivalDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {arrivalDate ? format(arrivalDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={arrivalDate}
                  onSelect={setArrivalDate}
                  initialFocus
                  formatters={{
                    formatCaption: (date) => format(date, "MMMM yyyy", { locale: pt }),
                    formatDay: (date) => format(date, "d", { locale: pt })
                  }}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
