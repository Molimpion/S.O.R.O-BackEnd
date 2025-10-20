// src/validators/ocorrenciaValidator.ts (CORRIGIDO)
import { z } from 'zod';

// Apenas o `createOcorrenciaSchema` precisa ser envolvido pelo `body`, pois ele valida o corpo de uma requisição POST.
export const createOcorrenciaSchema = z.object({
  body: z.object({ // <-- Adicionado
    data_acionamento: z.string({ required_error: 'A data de acionamento é obrigatória.' }).datetime(),
    hora_acionamento: z.string({ required_error: 'A hora de acionamento é obrigatória.' }).datetime(),
    id_subgrupo_fk: z.string({ required_error: 'O ID do subgrupo é obrigatório.' }).uuid(),
    id_bairro_fk: z.string({ required_error: 'O ID do bairro é obrigatório.' }).uuid(),
    id_forma_acervo_fk: z.string({ required_error: 'O ID da forma de acervo é obrigatório.' }).uuid(),
    nr_aviso: z.string().optional(),
  }),
});

// O `listOcorrenciaSchema` valida `req.query`, então ele já está correto e não precisa de alterações.
// **ATUALIZADO:** Adicionado o validador `type` para exportação unificada.
export const listOcorrenciaSchema = z.object({
  query: z.object({
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
    bairroId: z.string().uuid().optional(),
    subgrupoId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
    // Novo parâmetro de filtro: tipo de exportação
    type: z.enum(['csv', 'pdf'], {
      required_error: 'O tipo de exportação (csv ou pdf) é obrigatório.',
      invalid_type_error: "Tipo de exportação inválido. Use 'csv' ou 'pdf'.",
    }),
  }),
});