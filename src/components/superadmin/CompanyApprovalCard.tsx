import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Building, Mail, Phone, MapPin, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Company } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CompanyApprovalCardProps {
  company: Company;
  onUpdate: () => void;
}

export const CompanyApprovalCard: React.FC<CompanyApprovalCardProps> = ({ company, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Update company status
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          status: 'active',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          approval_notes: notes,
        })
        .eq('id', company.id);

      if (updateError) throw updateError;

      // Create notification
      await supabase.from('notifications').insert([{
        user_id: company.id,
        type: 'company_approved',
        title: 'Cadastro Aprovado! 🎉',
        message: 'Sua empresa foi aprovada e você já pode acessar a plataforma.',
        action_url: '/company',
        action_label: 'Acessar Dashboard'
      }]);

      toast.success('Empresa aprovada com sucesso');
      setShowApproveDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Erro ao aprovar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Por favor, informe o motivo da rejeição');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: rejectionReason,
        })
        .eq('id', company.id);

      if (updateError) throw updateError;

      // Create notification
      await supabase.from('notifications').insert([{
        user_id: company.id,
        type: 'company_rejected',
        title: 'Cadastro Rejeitado',
        message: `Seu cadastro foi rejeitado. Motivo: ${rejectionReason}`,
        action_url: '/register/company',
        action_label: 'Corrigir Cadastro'
      }]);

      toast.success('Empresa rejeitada');
      setShowRejectDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast.error('Erro ao rejeitar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {company.name}
            </CardTitle>
            <Badge variant="outline">{company.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>CNPJ: {company.cnpj}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{company.phone}</span>
              </div>
            </div>

            <div className="space-y-2">
              {company.city && company.state && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{company.city}, {company.state}</span>
                </div>
              )}
              <div className="text-muted-foreground">
                Cadastrado em: {new Date(company.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {company.registration_document_url && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(company.registration_document_url!, '_blank')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Documentos
              </Button>
            </div>
          )}

          {company.status === 'pending_approval' && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowApproveDialog(true)}
                className="flex-1"
                disabled={loading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button
                onClick={() => setShowRejectDialog(true)}
                variant="destructive"
                className="flex-1"
                disabled={loading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Empresa</DialogTitle>
            <DialogDescription>
              Confirme a aprovação de {company.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Internas (Opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre a aprovação..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Aprovando...
                </>
              ) : (
                'Confirmar Aprovação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Empresa</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição para {company.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection">Motivo da Rejeição *</Label>
              <Textarea
                id="rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Documentação incompleta, CNPJ inválido..."
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejeitando...
                </>
              ) : (
                'Confirmar Rejeição'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
