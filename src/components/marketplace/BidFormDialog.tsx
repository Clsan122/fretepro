import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BidFormDialogProps {
  freight: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const BidFormDialog = ({ 
  freight, 
  open, 
  onOpenChange,
  onSuccess
}: BidFormDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    proposed_price: freight?.suggested_price || "",
    estimated_pickup_date: null as Date | null,
    estimated_delivery_date: null as Date | null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma proposta",
        variant: "destructive"
      });
      return;
    }

    if (!formData.proposed_price) {
      toast({
        title: "Erro",
        description: "O preço proposto é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Buscar driver_id do usuário atual
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverError || !driver) {
        toast({
          title: "Erro",
          description: "Você precisa ter um perfil de motorista cadastrado para enviar propostas",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Inserir proposta
      const { error: bidError } = await supabase
        .from('freight_bids')
        .insert({
          freight_id: freight.id,
          driver_id: driver.id,
          user_id: user.id,
          proposed_price: parseFloat(formData.proposed_price),
          estimated_pickup_date: formData.estimated_pickup_date?.toISOString(),
          estimated_delivery_date: formData.estimated_delivery_date?.toISOString(),
          message: formData.message || null,
          status: 'pending'
        });

      if (bidError) throw bidError;

      // Criar notificação para a empresa
      await supabase
        .from('notifications')
        .insert({
          user_id: freight.posted_by,
          type: 'new_bid',
          title: 'Nova proposta recebida',
          message: `Você recebeu uma nova proposta para o frete de ${freight.origin_city} para ${freight.destination_city}`,
          data: { 
            freight_id: freight.id,
            proposed_price: formData.proposed_price
          }
        });

      toast({
        title: "Proposta enviada!",
        description: "A empresa receberá sua proposta e entrará em contato em breve."
      });

      onSuccess();
      onOpenChange(false);
      
      // Limpar form
      setFormData({
        proposed_price: "",
        estimated_pickup_date: null,
        estimated_delivery_date: null,
        message: ""
      });

    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a proposta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do frete */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-medium">
              {freight?.origin_city}, {freight?.origin_state} → {freight?.destination_city}, {freight?.destination_state}
            </p>
            {freight?.suggested_price && (
              <p className="text-sm text-muted-foreground">
                Preço sugerido: R$ {freight.suggested_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Preço proposto */}
          <div className="space-y-2">
            <Label htmlFor="proposed_price">
              Seu Preço Proposto <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="proposed_price"
                type="number"
                step="0.01"
                min="0"
                className="pl-10"
                placeholder="0,00"
                value={formData.proposed_price}
                onChange={(e) => setFormData({ ...formData, proposed_price: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Data estimada de coleta */}
          <div className="space-y-2">
            <Label>Data Estimada de Coleta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.estimated_pickup_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.estimated_pickup_date ? (
                    format(formData.estimated_pickup_date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    "Selecione uma data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.estimated_pickup_date || undefined}
                  onSelect={(date) => setFormData({ ...formData, estimated_pickup_date: date || null })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data estimada de entrega */}
          <div className="space-y-2">
            <Label>Data Estimada de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.estimated_delivery_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.estimated_delivery_date ? (
                    format(formData.estimated_delivery_date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    "Selecione uma data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.estimated_delivery_date || undefined}
                  onSelect={(date) => setFormData({ ...formData, estimated_delivery_date: date || null })}
                  disabled={(date) => 
                    date < new Date() || 
                    (formData.estimated_pickup_date && date < formData.estimated_pickup_date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Mensagem opcional */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Adicione informações relevantes sobre sua proposta..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Proposta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
