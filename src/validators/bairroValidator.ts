// src/validators/bairroValidator.ts (CORRIGIDO)
import { z } from 'zod';

export const bairroSchema = z.object({
  body: z.object({
    // Corrigido: Agora aceita qualquer string, pois o Enum foi removido
    nome_bairro: z.string({ required_error: 'O nome do bairro é obrigatório.' }).min(1), 
    regiao: z.string().optional(),
    ais: z.string().optional(),
  }),
});