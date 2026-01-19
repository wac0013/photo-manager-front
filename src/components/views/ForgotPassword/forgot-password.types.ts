import * as z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
