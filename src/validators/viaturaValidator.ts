import { z } from 'zod';

export const createViaturaSchema = z.object({
  body: z.object({
    tipo_vt: z.string({ required_error: 'O tipo da viatura é obrigatório.' }),
    numero_viatura: z.string({ required_error: 'O número da viatura é obrigatório.' }).min(1), 
    id_unidade_operacional_fk: z.string({ required_error: 'O ID da unidade operacional é obrigatório.' }).uuid(),
  }),
});

export const putViaturaSchema = z.object({
  body: z.object({
    tipo_vt: z.string({ required_error: 'O tipo da viatura é obrigatório.' }),
    numero_viatura: z.string({ required_error: 'O número da viatura é obrigatório.' }).min(1), 
    id_unidade_operacional_fk: z.string({ required_error: 'O ID da unidade operacional é obrigatório.' }).uuid(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID da viatura na URL é inválido." }),
  })
});

export const patchViaturaSchema = z.object({
  body: z.object({
    tipo_vt: z.string().optional(),
    numero_viatura: z.string().min(1).optional(), 
    id_unidade_operacional_fk: z.string().uuid().optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID da viatura na URL é inválido." }),
  })
});