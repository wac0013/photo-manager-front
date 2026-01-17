import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import { rootRoute } from './__root'

import { authClient } from '@/lib/auth-client'

const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.input<typeof loginSchema>

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginComponent,
})

function LoginComponent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/',
        rememberMe: data.rememberMe
      })

      if (signInError) {
        setError(signInError.message || 'E-mail ou senha incorretos')
        toast.error(signInError.message || 'Erro ao realizar login')
      } else {
        toast.success("Login realizado com sucesso! Bem-vindo de volta.")
        navigate({ to: '/' })
      }
    } catch (err) {
      console.error(err)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: 'google',
      })

      if (signInError) {
        setError(signInError.message || 'Erro ao entrar com Google.')
        toast.error(signInError.message || 'Erro ao entrar com Google.')
      }
    } catch (err) {
      console.error(err)
      setError('Erro inesperado no login com Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4 perspective-1000">
      <Card className="w-full max-w-md glass-card rounded-3xl border-none animate-flip-in shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-base">
            Entre com seus dados para acessar seus álbuns
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 mb-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 animate-in shake-in duration-300">
                {error}
              </div>
            )}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" title="Esqueceu a senha?" className="text-xs text-primary hover:underline">Esqueceu a senha?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-xl h-12 bg-muted/30 border-none"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-destructive ml-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked: boolean | 'indeterminate') => setValue('rememberMe', checked === true)}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer select-none"
              >
                Manter conectado
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Entrar
            </Button>
            
            <div className="relative w-full py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>

            <div className="text-sm text-center text-muted-foreground pt-2">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Crie uma agora
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
