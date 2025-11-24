import { z } from 'zod';

export const naturezaSchema = z.object({
  body: z.object({ 
    descricao: z.string({ required_error: 'A descrição da natureza é obrigatória.' }).min(1), 
  }),
});