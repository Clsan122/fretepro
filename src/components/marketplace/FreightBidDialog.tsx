import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MarketplaceFreight } from '@/types/marketplace';
import { useCreateFreightBid } from '@/hooks/useFreightBids';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FreightBidDialogProps {
  freight: MarketplaceFreight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FreightBidDialog = ({ freight, open, onOpenChange }: FreightBidDialogProps) => {
  const [proposedPrice, setProposedPrice] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [message, setMessage] = useState('');

  const createBid = useCreateFreightBid();

  const { data: driver } = useQuery({
    queryKey: ['my-driver'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freight || !driver) return;

    await createBid.mutateAsync({
      freight_id: freight.id,
      driver_id: driver.id,
      proposed_price: parseFloat(proposedPrice),
      estimated_pickup_date: new Date(pickupDate).toISOString(),
      estimated_delivery_date: new Date(deliveryDate).toISOString(),
      message,
    });

    onOpenChange(false);
    setProposedPrice('');
    setPickupDate('');
    setDeliveryDate('');
    setMessage('');
  };

  if (!freight) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fazer Proposta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="proposed-price">Valor Proposto (R$)</Label>
            <Input
              id="proposed-price"
              type="number"
              step="0.01"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Valor sugerido: R$ {freight.suggested_price.toFixed(2)}
            </p>
          </div>

          <div>
            <Label htmlFor="pickup-date">Data Estimada de Coleta</Label>
            <Input
              id="pickup-date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="delivery-date">Data Estimada de Entrega</Label>
            <Input
              id="delivery-date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Adicione informações relevantes sobre sua proposta..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={createBid.isPending} className="flex-1">
              {createBid.isPending ? 'Enviando...' : 'Enviar Proposta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
