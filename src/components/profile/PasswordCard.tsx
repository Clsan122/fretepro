
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Save, Loader2 } from "lucide-react";

interface PasswordCardProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleChangePassword: (e: React.FormEvent) => void;
  isChangingPassword?: boolean;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  handleChangePassword,
  isChangingPassword = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>
          Atualize sua senha de acesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" variant="required">Senha Atual</Label>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" variant="required">Nova Senha</Label>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" variant="required">Confirmar Nova Senha</Label>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando senha...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Alterar Senha
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
