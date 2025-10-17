// src/validators/grupamentoValidator.ts (CORRIGIDO)
import { z } from 'zod';

export const grupamentoSchema = z.object({
  body: z.object({ // <-- Adicionado
    nome_grupamento: z.string({ required_error: 'O nome do grupamento é obrigatório.' }),
    sigla: z.string({ required_error: 'A sigla é obrigatória.' }),
  }),
});