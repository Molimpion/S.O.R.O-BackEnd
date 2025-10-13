import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({ required_error: 'O nome é obrigatório' }).min(3, 'O nome precisa ter no mínimo 3 caracteres'),
  email: z.string({ required_error: 'O email é obrigatório' }).email('Formato de email inválido'),
  password: z.string({ required_error: 'A senha é obrigatória' }).min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  profile: z.enum(['ADMIN', 'ANALISTA', 'CHEFE'], { required_error: 'O perfil é obrigatório' }),
  matricula: z.string({ required_error: 'A matrícula é obrigatória' }),
  id_unidade_operacional_fk: z.string().uuid().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
