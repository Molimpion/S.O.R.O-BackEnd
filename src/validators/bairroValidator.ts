import { z } from 'zod';

// Schema para POST
export const createBairroSchema = z.object({
  body: z.object({
    nome_bairro: z.string({ required_error: 'O nome do bairro é obrigatório.' }).min(1), 
    regiao: z.string().optional(),
    ais: z.string().optional(),
    id_municipio_fk: z.string().uuid("O ID do município é inválido.").nullable().optional(), 
  }),
});

export const putBairroSchema = z.object({
  body: z.object({
    nome_bairro: z.string({ required_error: 'O nome do bairro é obrigatório.' }).min(1), 
    regiao: z.string().nullable(),
    ais: z.string().nullable(),
    id_municipio_fk: z.string().uuid("O ID do município é inválido.").nullable(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do bairro na URL é inválido." }),
  })
});

export const patchBairroSchema = z.object({
  body: z.object({
    nome_bairro: z.string().min(1).optional(), 
    regiao: z.string().nullable().optional(),
    ais: z.string().nullable().optional(),
    id_municipio_fk: z.string().uuid("O ID do município é inválido.").nullable().optional(), 
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do bairro na URL é inválido." }),
  })
});