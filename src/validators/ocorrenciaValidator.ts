import { z } from 'zod';

export const createOcorrenciaSchema = z.object({
  body: z.object({
    data_acionamento: z.string({ required_error: 'A data de acionamento é obrigatória.' }).datetime(),
    hora_acionamento: z.string({ required_error: 'A hora de acionamento é obrigatória.' }).datetime(),
    id_subgrupo_fk: z.string({ required_error: 'O ID do subgrupo é obrigatório.' }).uuid(),
    id_municipio_fk: z.string({ required_error: 'O ID do município é obrigatório.' }).uuid(),
    id_forma_acervo_fk: z.string({ required_error: 'O ID da forma de acervo é obrigatório.' }).uuid(),
    nr_aviso: z.string().optional(),
  }),
});