import { z } from 'zod';

// Schema para criação de um município
export const createMunicipioSchema = z.object({
  body: z.object({
    nome_municipio: z.string({ required_error: 'O nome do município é obrigatório.' })
                    .min(1, 'O nome do município não pode ser vazio.'),
  }),
});

// Schema para atualização (opcional, se você permitir renomear)
export const updateMunicipioSchema = z.object({
  body: z.object({
    nome_municipio: z.string({ required_error: 'O nome do município é obrigatório.' })
                    .min(1, 'O nome do município não pode ser vazio.')
                    .optional(), // Tornar opcional para PUT/PATCH
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do município na URL é inválido." }),
  })
});