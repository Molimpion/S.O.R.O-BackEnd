import { z } from 'zod';

// Schema para o registo de um novo utilizador
export const registerSchema = z.object({
  nome: z.string({ required_error: 'O nome é obrigatório' }).min(3, 'O nome precisa de ter no mínimo 3 caracteres'),
  email: z.string({ required_error: 'O email é obrigatório' }).email('Formato de email inválido'),
  senha_hash: z.string({ required_error: 'A senha é obrigatória' }).min(6, 'A senha precisa de ter no mínimo 6 caracteres'),
  tipo_perfil: z.enum(['ADMIN', 'ANALISTA', 'CHEFE'], { required_error: 'O perfil é obrigatório' }),
  matricula: z.string({ required_error: 'A matrícula é obrigatória' }),
  id_unidade_operacional_fk: z.string().uuid().optional(),
});

// Schema para o login
export const loginSchema = z.object({
  email: z.string().email(),
  senha_hash: z.string(),
});

// Schema para quando um admin atualiza um utilizador
export const userUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  tipo_perfil: z.enum(['ADMIN', 'ANALISTA', 'CHEFE']).optional(),
  id_unidade_operacional_fk: z.string().uuid().optional(),
  nome_guerra: z.string().optional(),
  posto_grad: z.string().optional(),
});