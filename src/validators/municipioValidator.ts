import { z } from 'zod';

export const createMunicipioSchema = z.object({
  body: z.object({
    nome_municipio: z.string({ required_error: 'O nome do município é obrigatório.' })
                    .min(1, 'O nome do município não pode ser vazio.'),
  }),
});

export const putMunicipioSchema = z.object({
  body: z.object({
    nome_municipio: z.string({ required_error: 'O nome do município é obrigatório.' })
                    .min(1, 'O nome do município não pode ser vazio.'),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do município na URL é inválido." }),
  })
});

export const patchMunicipioSchema = z.object({
  body: z.object({
    nome_municipio: z.string()
                    .min(1, 'O nome do município não pode ser vazio.')
                    .optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do município na URL é inválido." }),
  })
});