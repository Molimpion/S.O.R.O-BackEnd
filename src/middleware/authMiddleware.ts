// src/middleware/authMiddleware.ts (CORRIGIDO)
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { userId: string; profile: string }; // Mantemos 'profile' aqui pois é o nome no token
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado: nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    
    // O payload do token tem 'profile', que corresponde ao 'tipo_perfil' do banco
    req.user = decoded as { userId: string; profile: string };
    next();
  });
};

export const checkAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }

  // A verificação continua usando 'profile', que é o nome do campo dentro do token
  if (req.user.profile !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado: rota exclusiva para administradores.' });
  }

  next();
};