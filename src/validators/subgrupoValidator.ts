// src/validators/subgrupoValidator.ts (CORRIGIDO)
import { z } from 'zod';

export const subgrupoSchema = z.object({
  body: z.object({ // <-- Adicionado
    descricao_subgrupo: z.string({ required_error: 'A descrição do subgrupo é obrigatória.' }).min(3),
    id_grupo_fk: z.string({ required_error: 'O ID do grupo é obrigatório.' }).uuid(),
  }),
});