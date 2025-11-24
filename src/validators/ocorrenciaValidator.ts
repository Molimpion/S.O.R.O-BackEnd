import { z } from "zod";

export const createOcorrenciaSchema = z.object({
  body: z.object({
    data_acionamento: z
      .string({ required_error: "A data de acionamento é obrigatória." })
      .datetime(),
    hora_acionamento: z
      .string({ required_error: "A hora de acionamento é obrigatória." })
      .datetime(),
    id_subgrupo_fk: z
      .string({ required_error: "O ID do subgrupo é obrigatório." })
      .uuid(),
    id_bairro_fk: z
      .string({ required_error: "O ID do bairro é obrigatório." })
      .uuid(),
    id_forma_acervo_fk: z
      .string({ required_error: "O ID da forma de acervo é obrigatório." })
      .uuid(),
    nr_aviso: z.string().optional(),

    observacoes: z.string().optional(),

    localizacao: z
      .object({
        logradouro: z.string().optional(),
        tipo_logradouro: z.string().optional(),
        numero_km: z.string().optional(),
        referencia_logradouro: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),
  }),
});

export const listOcorrenciaSchema = z.object({
  query: z.object({
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    status: z
      .enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"])
      .optional(),
    bairroId: z.string().uuid().optional(),
    subgrupoId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
    periodo: z.enum(["day", "month"]).optional(),
  }),
});

export const reportOcorrenciaSchema = z.object({
  query: listOcorrenciaSchema.shape.query.extend({
    type: z.enum(["csv", "pdf"], {
      required_error: "O tipo de exportação (csv ou pdf) é obrigatório.",
      invalid_type_error: "Tipo de exportação inválido. Use 'csv' ou 'pdf'.",
    }),
  }),
});

export const putOcorrenciaSchema = z.object({
  body: z.object({
    status_situacao: z.enum(
      ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"],
      { required_error: "O status é obrigatório." }
    ),
    data_execucao_servico: z.string().datetime().nullable(),
    relacionado_eleicao: z.boolean({
      required_error: "O campo de eleição é obrigatório.",
    }),
    nr_aviso: z.string().nullable(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID da ocorrência na URL é inválido." }),
  }),
});

export const patchOcorrenciaSchema = z.object({
  body: z.object({
    status_situacao: z
      .enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"])
      .optional(),
    data_execucao_servico: z.string().datetime().nullable().optional(),
    relacionado_eleicao: z.boolean().optional(),
    nr_aviso: z.string().nullable().optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID da ocorrência na URL é inválido." }),
  }),
});
