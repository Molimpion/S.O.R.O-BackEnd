import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({
    required_error: 'O nome é obrigatório.',
  }).min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),

  email: z.string({
    required_error: 'O email é obrigatório.',
  }).email({ message: 'Formato de email inválido.' }),

  password: z.string({
    required_error: 'A senha é obrigatória.',
  }).min(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' }),

  profile: z.enum(['ADMIN', 'ANALISTA', 'CHEFE'], {
    required_error: 'O perfil é obrigatório.',
    invalid_type_error: "O perfil deve ser 'ADMIN', 'ANALISTA' ou 'CHEFE'.",
  }),
});

// Vamos aproveitar e já criar o schema de login também
export const loginSchema = z.object({
  email: z.string({
    required_error: 'O email é obrigatório.',
  }).email({ message: 'Formato de email inválido.' }),

  password: z.string({
    required_error: 'A senha é obrigatória.',
  }),
});