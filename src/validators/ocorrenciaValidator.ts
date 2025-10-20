// src/validators/ocorrenciaValidator.ts (FINALIZADO)
import { z } from 'zod';

// 1. Schema para CRIAÇÃO
export const createOcorrenciaSchema = z.object({
  body: z.object({
    data_acionamento: z.string({ required_error: 'A data de acionamento é obrigatória.' }).datetime(),
    hora_acionamento: z.string({ required_error: 'A hora de acionamento é obrigatória.' }).datetime(),
    id_subgrupo_fk: z.string({ required_error: 'O ID do subgrupo é obrigatório.' }).uuid(),
    id_bairro_fk: z.string({ required_error: 'O ID do bairro é obrigatório.' }).uuid(),
    id_forma_acervo_fk: z.string({ required_error: 'O ID da forma de acervo é obrigatório.' }).uuid(),
    nr_aviso: z.string().optional(),
  }),
});

// 2. Schema para LISTAGEM (Filtros. Não exige 'type')
export const listOcorrenciaSchema = z.object({
  query: z.object({
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
    bairroId: z.string().uuid().optional(),
    subgrupoId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
  }),
});

// 3. Schema para RELATÓRIOS (Exige 'type'. Usa a lista de filtros)
export const reportOcorrenciaSchema = z.object({
  query: listOcorrenciaSchema.shape.query.extend({
    type: z.enum(['csv', 'pdf'], {
      required_error: 'O tipo de exportação (csv ou pdf) é obrigatório.',
      invalid_type_error: "Tipo de exportação inválido. Use 'csv' ou 'pdf'.",
    }),
  }),
});