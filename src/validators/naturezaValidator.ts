import { z } from 'zod';

export const naturezaSchema = z.object({
  // ALTERADO: de z.string() para z.enum([...])
  descricao: z.enum(['PIROTECNICO', 'FISCALIZACAO', 'VISTORIA_DE_RISCO', 'OUTROS'], {
    required_error: 'A descrição da natureza é obrigatória.',
    invalid_type_error: "A descrição deve ser 'PIROTECNICO', 'FISCALIZACAO', 'VISTORIA_DE_RISCO' ou 'OUTROS'.",
  }),
});