import { z } from 'zod';

export const formaAcervoSchema = z.object({
  body: z.object({
    descricao: z.string({ required_error: 'A descrição da forma de acervo é obrigatória.' }).min(3),
  }),
});