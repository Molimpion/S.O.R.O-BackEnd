// src/validators/viaturaValidator.ts (CORRIGIDO)
import { z } from 'zod';

export const viaturaSchema = z.object({
  body: z.object({ // <-- Adicionado
    tipo_vt: z.string({ required_error: 'O tipo da viatura é obrigatório.' }),
    numero_viatura: z.enum([
      'CAT_01', 'CAT_02', 'CAT_03', 'CAT_04', 'ABT_01', 'ABT_02', 'ABT_03', 'ABT_04', 'AR_01', 'AR_02', 'AR_03', 'AR_04'
    ], {
      required_error: 'O número da viatura é obrigatório.',
      invalid_type_error: "Número de viatura inválido. Forneça um dos valores predefinidos."
    }),
    id_unidade_operacional_fk: z.string({ required_error: 'O ID da unidade operacional é obrigatório.' }).uuid(),
  }),
});