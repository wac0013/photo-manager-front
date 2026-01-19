import { Link } from '@tanstack/react-router';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForgotPassword } from './forgot-password.hooks';

export function ForgotPasswordView() {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    submitted,
    onSubmit,
  } = useForgotPassword();

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <Card className="w-full max-w-md glass-card rounded-3xl border-none shadow-2xl text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verifique seu e-mail</CardTitle>
            <CardDescription className="text-base px-4">
              Enviamos um link de recuperação para o seu e-mail. Por favor, verifique sua caixa de entrada e spam.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full rounded-xl h-12">
                Voltar para o login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4 perspective-1000">
      <Card className="w-full max-w-md glass-card rounded-3xl border-none animate-flip-in shadow-2xl">
        <CardHeader className="space-y-2">
          <Link to="/login" className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors w-fit mb-2">
            <ArrowLeft className="w-3 h-3" />
            Voltar para o login
          </Link>
          <CardTitle className="text-3xl font-bold">Recuperar senha</CardTitle>
          <CardDescription className="text-base">
            Digite seu e-mail abaixo e enviaremos as instruções para criar uma nova senha.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="rounded-xl h-12 bg-muted/30 border-none"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Enviar link de recuperação
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
