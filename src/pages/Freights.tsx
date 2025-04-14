import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Freight, Client, Driver } from "@/types";
import { 
  getFreightsByUserId, 
  saveFreight, 
  updateFreight, 
  deleteFreight,
  getClientsByUserId,
  getDriversByUserId
} from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  Eye, 
  Package, 
  ArrowUpDown,
  Printer,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FreightForm from "@/components/FreightForm";
import ReceiptGenerator from "@/components/ReceiptGenerator";
import { CARGO_TYPES, VEHICLE_TYPES } from "@/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePDFGenerator } from "@/components/collectionOrder/PDFGenerator";

const Freights: React.FC = () => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [filteredFreights, setFilteredFreights] = useState<Freight[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Freight>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReceiptSheetOpen, setIsReceiptSheetOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
  
  const [isClientReportOpen, setIsClientReportOpen] = useState(false);
  const [reportClientId, setReportClientId] = useState<string>("all");
  const clientReportRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { generatePDF } = usePDFGenerator();
  
  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      const userClients = getClientsByUserId(user.id);
      const userDrivers = getDriversByUserId(user.id);
      setFreights(userFreights);
      setFilteredFreights(userFreights);
      setClients(userClients);
      setDrivers(userDrivers);
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...freights];
    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(freight => {
        const client = clients.find(c => c.id === freight.clientId);
        return (
          freight.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          freight.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client && client.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }
    
    if (clientFilter !== "all") {
      filtered = filtered.filter(freight => freight.clientId === clientFilter);
    }
    
    filtered.sort((a, b) => {
      let valueA: string | number | Date = a[sortField] as string;
      let valueB: string | number | Date = b[sortField] as string;
      
      if (sortField === "createdAt" || sortField === "departureDate" || sortField === "arrivalDate") {
        valueA = new Date(valueA || 0);
        valueB = new Date(valueB || 0);
      } else if (sortField === "totalValue" || sortField === "freightValue") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }
      
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredFreights(filtered);
  }, [freights, searchTerm, clientFilter, sortField, sortDirection, clients]);

  const handleSort = (field: keyof Freight) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddFreight = (freight: Freight) => {
    saveFreight(freight);
    
    setFreights(prevFreights => [...prevFreights, freight]);
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Frete registrado",
      description: "O frete foi registrado com sucesso!",
    });
  };

  const handleEditFreight = (freight: Freight) => {
    updateFreight(freight);
    
    setFreights(prevFreights => 
      prevFreights.map(f => (f.id === freight.id ? freight : f))
    );
    
    setIsEditDialogOpen(false);
    setSelectedFreight(null);
    
    toast({
      title: "Frete atualizado",
      description: "As informações do frete foram atualizadas com sucesso!",
    });
  };

  const handleDeleteFreight = () => {
    if (selectedFreight) {
      deleteFreight(selectedFreight.id);
      
      setFreights(prevFreights => 
        prevFreights.filter(f => f.id !== selectedFreight.id)
      );
      
      setIsDeleteDialogOpen(false);
      setSelectedFreight(null);
      
      toast({
        title: "Frete removido",
        description: "O frete foi removido com sucesso!",
      });
    }
  };

  const handleGenerateClientReport = () => {
    setIsClientReportOpen(true);
  };

  const handleSaveClientReport = () => {
    if (clientReportRef.current) {
      const client = clients.find(c => c.id === reportClientId);
      const clientName = client ? client.name.replace(/\s+/g, '-').toLowerCase() : 'todos-clientes';
      
      generatePDF({
        elementId: 'client-report-container',
        fileName: `relatorio-fretes-${clientName}.pdf`,
        format: "a4",
        orientation: "portrait"
      });
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente não encontrado";
  };

  const getCargoTypeLabel = (value: string) => {
    const type = CARGO_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getVehicleTypeLabel = (value: string) => {
    const type = VEHICLE_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "Data inválida";
    }
  };

  const getDriverForFreight = (driverId?: string) => {
    if (!driverId || driverId === 'none') return undefined;
    return drivers.find(driver => driver.id === driverId);
  };

  const getFreightsByClient = (clientId: string) => {
    if (clientId === 'all') {
      return freights;
    } else {
      return freights.filter(freight => freight.clientId === clientId);
    }
  };

  const calculateReportTotals = (freightsList: Freight[]) => {
    return {
      count: freightsList.length,
      totalValue: freightsList.reduce((sum, freight) => sum + freight.totalValue, 0),
      totalWeight: freightsList.reduce((sum, freight) => sum + freight.weight, 0),
      totalVolumes: freightsList.reduce((sum, freight) => sum + freight.volumes, 0)
    };
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Fretes</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-freight-600 hover:bg-freight-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Frete
            </Button>
            
            <Button variant="outline" onClick={handleGenerateClientReport}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório por Cliente
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar fretes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-[250px]">
            <Select
              value={clientFilter}
              onValueChange={setClientFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredFreights.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("clientId")}
                    >
                      Cliente
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("originCity")}
                    >
                      Origem
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("destinationCity")}
                    >
                      Destino
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("departureDate")}
                    >
                      Data
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort("totalValue")}
                    >
                      Valor (R$)
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFreights.map((freight) => (
                  <TableRow key={freight.id}>
                    <TableCell className="font-medium">
                      {getClientName(freight.clientId)}
                    </TableCell>
                    <TableCell>
                      {freight.originCity}/{freight.originState}
                    </TableCell>
                    <TableCell>
                      {freight.destinationCity}/{freight.destinationState}
                    </TableCell>
                    <TableCell>
                      {formatDate(freight.departureDate)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {freight.totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedFreight(freight);
                            setIsDetailsDialogOpen(true);
                          }}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedFreight(freight);
                            setIsReceiptSheetOpen(true);
                          }}
                          title="Gerar recibo"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedFreight(freight);
                            setIsEditDialogOpen(true);
                          }}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedFreight(freight);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Excluir"
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              {searchTerm || clientFilter !== "all"
                ? "Nenhum frete encontrado com os critérios de busca."
                : "Você ainda não registrou nenhum frete."}
            </p>
            {!searchTerm && clientFilter === "all" && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar seu primeiro frete
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Novo Frete</DialogTitle>
            <DialogDescription>
              Preencha os dados para registrar um novo frete.
            </DialogDescription>
          </DialogHeader>
          <FreightForm
            onSave={handleAddFreight}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Frete</DialogTitle>
            <DialogDescription>
              Atualize os dados do frete.
            </DialogDescription>
          </DialogHeader>
          {selectedFreight && (
            <FreightForm
              freightToEdit={selectedFreight}
              onSave={handleEditFreight}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedFreight(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Frete</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este frete? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFreight}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={isReceiptSheetOpen} onOpenChange={setIsReceiptSheetOpen}>
        <SheetContent className="sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle>Recibo de Frete</SheetTitle>
            <SheetDescription>
              Gere e imprima um recibo para este frete.
            </SheetDescription>
          </SheetHeader>
          {selectedFreight && (
            <div className="mt-6">
              <ReceiptGenerator 
                freight={selectedFreight} 
                clients={clients}
                user={user!} 
                driver={getDriverForFreight(selectedFreight.driverId)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Frete</DialogTitle>
          </DialogHeader>
          {selectedFreight && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{getClientName(selectedFreight.clientId)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Data de registro</Label>
                  <p>{formatDate(selectedFreight.createdAt)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Origem</Label>
                <p className="font-medium">
                  {selectedFreight.originCity}/{selectedFreight.originState} - {formatDate(selectedFreight.departureDate)}
                </p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Destino</Label>
                <p className="font-medium">
                  {selectedFreight.destinationCity}/{selectedFreight.destinationState} - {formatDate(selectedFreight.arrivalDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Tipo de carga</Label>
                  <p>{getCargoTypeLabel(selectedFreight.cargoType)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tipo de veículo</Label>
                  <p>{getVehicleTypeLabel(selectedFreight.vehicleType)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Volumes</Label>
                  <p>{selectedFreight.volumes}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Peso</Label>
                  <p>{selectedFreight.weight} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Dimensões</Label>
                  <p>{selectedFreight.dimensions || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Cubagem</Label>
                  <p>{selectedFreight.cubicMeasurement} m³</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Valores</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Valor do frete</Label>
                    <p>R$ {selectedFreight.freightValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Diária</Label>
                    <p>R$ {selectedFreight.dailyRate.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Outros custos</Label>
                    <p>R$ {selectedFreight.otherCosts.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Pedágio</Label>
                    <p>R$ {selectedFreight.tollCosts.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <Label className="font-semibold">Total</Label>
                    <p className="text-lg font-bold">R$ {selectedFreight.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {selectedFreight.proofOfDeliveryImage && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Comprovante de entrega</h3>
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={selectedFreight.proofOfDeliveryImage} 
                      alt="Comprovante de entrega" 
                      className="max-h-64 mx-auto"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    setSelectedFreight(null);
                  }}
                >
                  Fechar
                </Button>
                <Button 
                  type="button"
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    setIsReceiptSheetOpen(true);
                  }}
                >
                  Gerar Recibo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isClientReportOpen} onOpenChange={setIsClientReportOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Relatório de Fretes por Cliente</DialogTitle>
            <DialogDescription>
              Selecione um cliente para gerar um relatório de todos os fretes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <Label htmlFor="reportClient">Cliente</Label>
            <Select
              value={reportClientId}
              onValueChange={setReportClientId}
            >
              <SelectTrigger id="reportClient">
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={handleSaveClientReport}>
              <Download className="h-4 w-4 mr-2" />
              Salvar PDF
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
          
          <div id="client-report-container" ref={clientReportRef} className="bg-white p-4 rounded border">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">Relatório de Fretes</h2>
              <p className="text-gray-500">
                {reportClientId === 'all' 
                  ? 'Todos os clientes' 
                  : `Cliente: ${getClientName(reportClientId)}`}
              </p>
              <p className="text-gray-500 text-sm">
                Data de geração: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            {reportClientId !== 'all' && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  {clients.find(c => c.id === reportClientId) && (
                    <div>
                      <p><strong>Nome:</strong> {getClientName(reportClientId)}</p>
                      <p><strong>Cidade/Estado:</strong> {clients.find(c => c.id === reportClientId)?.city}/{clients.find(c => c.id === reportClientId)?.state}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const reportFreights = getFreightsByClient(reportClientId);
                  const totals = calculateReportTotals(reportFreights);
                  
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Total de Fretes</p>
                        <p className="text-2xl font-bold">{totals.count}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Valor Total (R$)</p>
                        <p className="text-2xl font-bold">{totals.totalValue.toFixed(2)}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Peso Total (kg)</p>
                        <p className="text-2xl font-bold">{totals.totalWeight.toFixed(2)}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Volumes</p>
                        <p className="text-2xl font-bold">{totals.totalVolumes}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            
            <div className="rounded-md border overflow-x-auto mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {reportClientId === 'all' && <TableHead>Cliente</TableHead>}
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Peso (kg)</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFreightsByClient(reportClientId).map((freight) => (
                    <TableRow key={freight.id}>
                      {reportClientId === 'all' && (
                        <TableCell className="font-medium">
                          {getClientName(freight.clientId)}
                        </TableCell>
                      )}
                      <TableCell>
                        {freight.originCity}/{freight.originState}
                      </TableCell>
                      <TableCell>
                        {freight.destinationCity}/{freight.destinationState}
                      </TableCell>
                      <TableCell>
                        {formatDate(freight.departureDate)}
                      </TableCell>
                      <TableCell>
                        {freight.weight}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {freight.totalValue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>Documento gerado pelo sistema de gerenciamento de fretes.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Freights;
