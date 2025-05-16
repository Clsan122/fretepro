
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

export const LoginForm = () => {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    showPassword, 
    setShowPassword,
    keepLoggedIn,
    setKeepLoggedIn,
    isLoggingIn,
    handleLogin,
    validateEmail
  } = useLoginForm();

  return (
    <Card className="shadow-lg border-freight-200 dark:border-freight-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-freight-800 dark:text-freight-200">Entrar</CardTitle>
        <CardDescription className="text-freight-600 dark:text-freight-400">
          Acesse sua conta para gerenciar seus fretes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-freight-700 dark:text-freight-300">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-4 w-4 text-freight-400 dark:text-freight-500" />
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-freight-300 dark:border-freight-700 focus:border-freight-500 dark:focus:border-freight-500"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-freight-700 dark:text-freight-300">Senha</Label>
              <a
                href="/forgot-password"
                className="text-sm text-freight-600 hover:text-freight-800 dark:text-freight-400 dark:hover:text-freight-300 hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-freight-400 dark:text-freight-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border-freight-300 dark:border-freight-700 focus:border-freight-500 dark:focus:border-freight-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-freight-400 hover:text-freight-600 dark:text-freight-500 dark:hover:text-freight-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="keep-logged-in" 
              checked={keepLoggedIn}
              onCheckedChange={(checked) => setKeepLoggedIn(checked === true)}
            />
            <Label 
              htmlFor="keep-logged-in" 
              className="text-sm text-freight-700 dark:text-freight-300 cursor-pointer"
            >
              Permanecer logado
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-freight-600 hover:bg-freight-700 text-white"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-freight-600 dark:text-freight-400">
            Não tem uma conta?{' '}
            <a 
              href="/register" 
              className="font-medium text-freight-600 hover:text-freight-800 dark:text-freight-400 dark:hover:text-freight-300 hover:underline"
            >
              Registre-se
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
