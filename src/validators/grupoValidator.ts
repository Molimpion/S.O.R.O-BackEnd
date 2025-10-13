import { z } from 'zod';

export const grupoSchema = z.object({
  body: z.object({
    descricao_grupo: z.string({ required_error: 'A descrição do grupo é obrigatória.' }).min(3),
    id_natureza_fk: z.string({ required_error: 'O ID da natureza é obrigatório.' }).uuid(),
  }),
});