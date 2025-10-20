// src/validators/ocorrenciaValidator.ts (CORRIGIDO)
import { z } from 'zod';

// ... (createOcorrenciaSchema inalterado) ...

// 1. Schema para LISTAGEM (Filtros são opcionais. Não exige 'type')
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

// 2. Schema para RELATÓRIOS (Adiciona 'type' OBRIGATÓRIO)
// Estende o schema de listagem para herdar os filtros, mas adiciona 'type'.
export const reportOcorrenciaSchema = z.object({
  query: listOcorrenciaSchema.shape.query.extend({
    type: z.enum(['csv', 'pdf'], {
      required_error: 'O tipo de exportação (csv ou pdf) é obrigatório.',
      invalid_type_error: "Tipo de exportação inválido. Use 'csv' ou 'pdf'.",
    }),
  }),
});