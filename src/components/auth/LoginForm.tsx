
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  keepLoggedIn: z.boolean().default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    isLoggingIn,
    showPassword,
    setShowPassword,
    handleLogin
  } = useLoginForm();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keepLoggedIn: false
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log("Form submitted with values:", values);
    handleLogin({
      email: values.email,
      password: values.password,
      keepLoggedIn: values.keepLoggedIn,
      event: null
    });
  };

  return (
    <Card className="shadow-lg border-freight-200 dark:border-freight-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-freight-800 dark:text-freight-200">Entrar</CardTitle>
        <CardDescription className="text-freight-600 dark:text-freight-400">
          Acesse sua conta para gerenciar seus fretes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-freight-700 dark:text-freight-300">Email</FormLabel>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-freight-400 dark:text-freight-500" />
                    <FormControl>
                      <Input
                        placeholder="nome@exemplo.com"
                        type="email"
                        className="pl-10 border-freight-300 dark:border-freight-700 focus:border-freight-500 dark:focus:border-freight-500"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-freight-700 dark:text-freight-300">Senha</FormLabel>
                    <a
                      href="/forgot-password"
                      className="text-sm text-freight-600 hover:text-freight-800 dark:text-freight-400 dark:hover:text-freight-300 hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-freight-400 dark:text-freight-500" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-freight-300 dark:border-freight-700 focus:border-freight-500 dark:focus:border-freight-500"
                        {...field}
                      />
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="keepLoggedIn"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      id="keep-logged-in" 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel 
                    htmlFor="keep-logged-in" 
                    className="text-sm text-freight-700 dark:text-freight-300 cursor-pointer"
                  >
                    Permanecer logado
                  </FormLabel>
                </FormItem>
              )}
            />
            
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
        </Form>
      </CardContent>
    </Card>
  );
};
