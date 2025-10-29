import { z } from 'zod';

export const bairroSchema = z.object({
  body: z.object({
    nome_bairro: z.string({ required_error: 'O nome do bairro é obrigatório.' }).min(1), 
    regiao: z.string().optional(),
    ais: z.string().optional(),
  }),
});