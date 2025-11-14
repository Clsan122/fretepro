import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApprovalPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl">Cadastro Enviado com Sucesso!</CardTitle>
          <CardDescription>
            Seu cadastro está em análise pela nossa equipe
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-center">O que acontece agora?</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <p>Nossa equipe irá analisar seus documentos e informações</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <p>Se necessário, entraremos em contato para esclarecimentos</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <p>Você receberá um email quando seu cadastro for aprovado</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <p>Após aprovação, você poderá acessar a plataforma completa</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm text-center font-medium">
              ⏱️ Tempo médio de análise: <span className="text-primary">24 a 48 horas</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Precisa de ajuda? Entre em contato:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                suporte@fretevalor.com
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                (11) 9999-9999
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="outline"
            >
              Voltar para a Página Inicial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalPending;
