import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { registerSchema } from './register.types';
import type { RegisterFormValues } from './register.types';

export function useRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: '/',
      });

      if (signUpError) {
        setError(signUpError.message || 'Erro ao realizar cadastro');
        toast.error(signUpError.message || 'Erro ao realizar cadastro');
      } else {
        toast.success("Cadastro realizado com sucesso! Bem-vindo.");
        navigate({ to: '/' });
      }
    } catch (err) {
      console.error(err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    error,
    onSubmit,
  };
}
