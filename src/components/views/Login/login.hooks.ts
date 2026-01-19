import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { loginSchema } from './login.types';
import type { LoginFormValues } from './login.types';

export function useLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/',
        rememberMe: data.rememberMe
      });

      if (signInError) {
        setError(signInError.message || 'E-mail ou senha incorretos');
        toast.error(signInError.message || 'Erro ao realizar login');
      } else {
        toast.success("Login realizado com sucesso! Bem-vindo de volta.");
        navigate({ to: '/' });
      }
    } catch (err) {
      console.error(err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: 'google',
      });

      if (signInError) {
        setError(signInError.message || 'Erro ao entrar com Google.');
        toast.error(signInError.message || 'Erro ao entrar com Google.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro inesperado no login com Google.');
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    rememberMe,
    setValue,
    loading,
    error,
    onSubmit,
    handleGoogleSignIn,
  };
}
