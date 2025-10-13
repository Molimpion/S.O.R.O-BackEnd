import { z } from 'zod';

export const unidadeSchema = z.object({
  body: z.object({
    nome_unidade: z.string({ required_error: 'O nome da unidade é obrigatório.' }),
    endereco_base: z.string().optional(),
    id_grupamento_fk: z.string({ required_error: 'O ID do grupamento é obrigatório.' }).uuid(),
  }),
});