import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "O nome é obrigatório" }).min(3),
    email: z.string({ required_error: "O email é obrigatório" }).email(),
    password: z.string().min(6).optional(),
    profile: z.enum(["ADMIN", "ANALISTA", "CHEFE"], {
      required_error: "O perfil é obrigatório",
    }),
    matricula: z.string({ required_error: "A matrícula é obrigatória" }),
    id_unidade_operacional_fk: z.string().uuid().nullable().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string({ required_error: "A senha é obrigatória" }),
  }),
});

export const putUserSchema = z.object({
  body: z.object({
    nome: z.string({ required_error: "O nome é obrigatório" }).min(3),
    email: z.string({ required_error: "O email é obrigatório" }).email(),
    tipo_perfil: z.enum(["ADMIN", "ANALISTA", "CHEFE"], {
      required_error: "O perfil é obrigatório",
    }),
    id_unidade_operacional_fk: z
      .string()
      .uuid("ID de unidade inválido")
      .nullable(),
    nome_guerra: z.string().nullable(),
    posto_grad: z.string().nullable(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do usuário na URL é inválido." }),
  }),
});

export const patchUserSchema = z.object({
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    tipo_perfil: z.enum(["ADMIN", "ANALISTA", "CHEFE"]).optional(),
    id_unidade_operacional_fk: z
      .string()
      .uuid("ID de unidade inválido")
      .nullable()
      .optional(),
    nome_guerra: z.string().nullable().optional(),
    posto_grad: z.string().nullable().optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "O ID do usuário na URL é inválido." }),
  }),
});
