import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { resetPasswordSchema } from './reset-password.types';
import type { ResetPasswordFormValues } from './reset-password.types';

export function useResetPassword(token?: string) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Token de recuperação inválido ou expirado.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (error) {
        toast.error(error.message || 'Erro ao redefinir senha');
      } else {
        toast.success('Senha redefinida com sucesso!');
        navigate({ to: '/login' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    navigate,
  };
}
