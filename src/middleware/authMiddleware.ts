import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/api-errors';
// import { UserService } from '../services/userService'; // Comentei esta linha se não for usada nas funções abaixo

// const userService = new UserService(); // Comentei esta linha se não for usada nas funções abaixo

export interface CustomRequest extends Request {
  user: {
    id: string;
    // --- CORREÇÃO AQUI (de 'role' para 'profile') ---
    profile: string; 
    unidadeOperacionalId: string | null;
  };
}

// 1. Verifica a validade do JWT token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    throw new ApiError('Acesso negado. Nenhum token fornecido.', 401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'secret') as CustomRequest['user'];
    (req as CustomRequest).user = user;
    next();
  } catch (err) {
    // Se o token for inválido (expirado, assinatura errada, etc.)
    throw new ApiError('Token inválido.', 403);
  }
};

// 2. Verifica se o utilizador autenticado é um ADMIN
export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as CustomRequest).user;

  // --- CORREÇÃO AQUI (de 'user.role' para 'user.profile') ---
  if (user.profile !== 'ADMIN') {
    throw new ApiError('Acesso negado. Permissão de administrador necessária.', 403);
  }
  next();
};

// 3. Verifica se o utilizador autenticado é um CHEFE
export const checkChefe = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as CustomRequest).user;

  // --- CORREÇÃO AQUI (de 'user.role' para 'user.profile') ---
  if (user.profile !== 'CHEFE') {
    throw new ApiError('Acesso negado. Permissão de chefe necessária.', 403);
  }
  next();
};

// 4. CORREÇÃO: Combina authenticateToken e checkAdmin para uso fácil nas rotas
/**
 * Array de middlewares: (1) Garante que o usuário está autenticado, (2) Garante que o usuário é ADMIN.
 */
export const authenticateAdmin = [authenticateToken, checkAdmin];