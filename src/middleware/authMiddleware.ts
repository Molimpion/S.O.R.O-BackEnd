import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
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
    
    req.user = decoded as { userId: string; profile: string };
    next();
  });
};

export const checkAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }


  if (req.user.profile !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado: rota exclusiva para administradores.' });
  }

  next();
};

export const checkChefe = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }

  // Verifica se o perfil é CHEFE
  if (req.user.profile !== 'CHEFE') {
    // Permite que ADMINS também executem ações de CHEFE, se necessário.
    // Se a regra for ESTRITAMENTE CHEFE, remova '&& req.user.profile !== 'ADMIN''
    if (req.user.profile !== 'ADMIN') {
       return res.status(403).json({ error: 'Acesso negado: rota exclusiva para Chefes de Operação.' });
    }
  }

  next();
};