// src/validators/authValidator.ts (CORRIGIDO)
import { z } from 'zod';

// Schema para o registo
export const registerSchema = z.object({
  body: z.object({ // <-- Adicionado para validar o corpo da requisição
    name: z.string({ required_error: 'O nome é obrigatório' }).min(3),
    email: z.string({ required_error: 'O email é obrigatório' }).email(),
    password: z.string({ required_error: 'A senha é obrigatória' }).min(6),
    profile: z.enum(['ADMIN', 'ANALISTA', 'CHEFE'], { required_error: 'O perfil é obrigatório' }),
    matricula: z.string({ required_error: 'A matrícula é obrigatória' }),
    id_unidade_operacional_fk: z.string().uuid().optional(),
  })
});

// Schema para o login
export const loginSchema = z.object({
  body: z.object({ // <-- Adicionado para validar o corpo da requisição
    email: z.string().email(),
    password: z.string({ required_error: 'A senha é obrigatória' }),
  })
});

// Schema para atualização de utilizador
export const userUpdateSchema = z.object({
  body: z.object({ // <-- Adicionado para validar o corpo da requisição
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    tipo_perfil: z.enum(['ADMIN', 'ANALISTA', 'CHEFE']).optional(),
    id_unidade_operacional_fk: z.string().uuid().optional(),
    nome_guerra: z.string().optional(),
    posto_grad: z.string().optional(),
  })
});