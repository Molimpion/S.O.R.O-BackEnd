import { z } from 'zod';

export const naturezaSchema = z.object({
  // ALTERADO: A lista de enum foi atualizada
  descricao: z.enum(
    ['INCENDIO', 'ANIMAL', 'ARVORE', 'QUEIMADA', 'TRANSITO', 'RESGATE'],
    {
      required_error: 'A descrição da natureza é obrigatória.',
      invalid_type_error: "A descrição deve ser um dos valores predefinidos (INCENDIO, ANIMAL, etc.).",
    }
  ),
});