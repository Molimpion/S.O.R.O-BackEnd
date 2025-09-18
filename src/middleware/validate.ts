import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod'; // Importa 'z' e o tipo 'ZodError'

// A assinatura agora usa z.Schema, que é um tipo mais geral e seguro
export const validate = (schema: z.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // O parseAsync agora é feito diretamente no req.body, que é o que nos importa
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      // Se o erro for uma instância de ZodError, retorna um erro 400 mais detalhado
      if (error instanceof ZodError) {
        return res.status(400).json(
          error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          }))
        );
      }
      // Para outros tipos de erro, retorna um erro 500 genérico
      return res.status(500).json({ message: 'Internal server error' });
    }
  };