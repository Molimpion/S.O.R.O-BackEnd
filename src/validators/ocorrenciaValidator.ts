// src/validators/ocorrenciaValidator.ts
import { z } from 'zod';

// Schema para CRIAR uma ocorrência (o que já tínhamos)
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

// Schema para VALIDAR os filtros da listagem de ocorrências
export const listOcorrenciaSchema = z.object({
  query: z.object({
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    status: z.enum(['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
    municipioId: z.string().uuid().optional(),
    subgrupoId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
  }),
});