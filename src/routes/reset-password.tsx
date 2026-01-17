import { createRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Lock } from 'lucide-react'
import { rootRoute } from './__root'
import { authClient } from '@/lib/auth-client'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPasswordSearch {
  token?: string
}

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => {
    return {
      token: search.token as string | undefined,
    }
  },
  component: ResetPasswordComponent,
})

function ResetPasswordComponent() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/reset-password' })
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Token de recuperação inválido ou expirado.')
      return
    }

    setLoading(true)
    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      })

      if (error) {
        toast.error(error.message || 'Erro ao redefinir senha')
      } else {
        toast.success('Senha redefinida com sucesso!')
        navigate({ to: '/login' })
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <Card className="w-full max-w-md glass-card rounded-3xl border-none shadow-2xl text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Token Inválido</CardTitle>
            <CardDescription className="text-base px-4">
              O link de recuperação parece ser inválido ou expirou. Por favor, solicite um novo link.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full rounded-xl h-12" 
              onClick={() => navigate({ to: '/forgot-password' })}
            >
              Solicitar novo link
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4 perspective-1000">
      <Card className="w-full max-w-md glass-card rounded-3xl border-none animate-flip-in shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Nova senha</CardTitle>
          <CardDescription className="text-base">
            Crie uma nova senha segura para sua conta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
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
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
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
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Redefinir senha
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
