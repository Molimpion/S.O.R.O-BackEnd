import { z } from 'zod';

export const createOcorrenciaSchema = z.object({
  data_acionamento: z.string({ required_error: 'A data de acionamento é obrigatória.' }).datetime(),
  hora_acionamento: z.string({ required_error: 'A hora de acionamento é obrigatória.' }).datetime(),
  id_subgrupo_fk: z.string({ required_error: 'O ID do subgrupo é obrigatório.' }).uuid(),
  id_bairro_fk: z.string({ required_error: 'O ID do bairro é obrigatório.' }).uuid(), // ALTERADO
  id_forma_acervo_fk: z.string({ required_error: 'O ID da forma de acervo é obrigatório.' }).uuid(),
  nr_aviso: z.string().optional(),
});

export const listOcorrenciaSchema = z.object({
  query: z.object({
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
    bairroId: z.string().uuid().optional(), // ALTERADO
    subgrupoId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
  }),
});