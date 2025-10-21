import { z } from 'zod';

export const viaturaSchema = z.object({
  body: z.object({
    tipo_vt: z.string({ required_error: 'O tipo da viatura é obrigatório.' }),
    numero_viatura: z.string({ required_error: 'O número da viatura é obrigatório.' }).min(1), 
    id_unidade_operacional_fk: z.string({ required_error: 'O ID da unidade operacional é obrigatório.' }).uuid(),
  }),
});