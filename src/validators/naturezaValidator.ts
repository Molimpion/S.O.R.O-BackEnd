// src/validators/naturezaValidator.ts (CORRIGIDO)
import { z } from 'zod';

export const naturezaSchema = z.object({
  body: z.object({ 
    // Corrigido: Agora aceita qualquer string, pois o Enum foi removido
    descricao: z.string({ required_error: 'A descrição da natureza é obrigatória.' }).min(1), 
  }),
});