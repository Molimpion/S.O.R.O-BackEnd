import { z } from 'zod';

export const municipioSchema = z.object({
  body: z.object({
    nome_municipio: z.string({ required_error: 'O nome do município é obrigatório.' }).min(3),
    regiao: z.string().optional(),
    ais: z.string().optional(),
  }),
});