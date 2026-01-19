import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { forgotPasswordSchema } from './forgot-password.types';
import type { ForgotPasswordFormValues } from './forgot-password.types';

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      });

      if (error) {
        toast.error(error.message || 'Erro ao processar solicitação');
      } else {
        setSubmitted(true);
        toast.success('E-mail de recuperação enviado!');
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
    submitted,
    onSubmit,
  };
}
