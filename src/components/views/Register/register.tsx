import { Link } from '@tanstack/react-router';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegister } from './register.hooks';

export function RegisterView() {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    error,
    onSubmit,
  } = useRegister();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <Card className="w-full max-w-md glass-card rounded-3xl border-none animate-in fade-in duration-500 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Criar conta</CardTitle>
          <CardDescription className="text-base">
            Cadastre-se para começar a gerenciar seus álbuns
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 mb-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                className="rounded-xl h-12 bg-muted/30 border-none"
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-xl h-12 bg-muted/30 border-none"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="rounded-xl h-12 bg-muted/30 border-none"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Criar conta
            </Button>
            <div className="text-sm text-center text-muted-foreground pt-2">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Entre aqui
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
