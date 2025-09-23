// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Esta é a mesma chave secreta que usamos no authService.
// O ideal é que ela venha de uma variável de ambiente (.env) para não se repetir.
const JWT_SECRET = 'SEGREDO_SUPER_SECRETO_PARA_PROJETO_BOMBEIROS';

// Definimos uma interface para estender o objeto Request do Express
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Pega o cabeçalho 'authorization' da requisição
  const authHeader = req.headers['authorization'];

  // 2. O token geralmente vem no formato "Bearer TOKEN". Nós pegamos apenas o token.
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Se não houver token, retorna um erro de "Não autorizado"
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado: nenhum token fornecido.' });
  }

  // 4. Verifica se o token é válido
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // Se o token for inválido (expirado, assinatura errada), retorna um erro de "Proibido"
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }

    // 5. Se o token for válido, 'decoded' conterá os dados que guardamos (userId e profile).
    // Nós adicionamos esses dados ao objeto 'req' para que as próximas funções (controladores)
    // possam saber qual usuário está fazendo a requisição.
    req.user = decoded as { userId: string; profile: string };

    // 6. Chama a próxima função no ciclo da requisição (geralmente, o controlador)
    next();
  });
};

// --- MIDDLEWARE PARA VERIFICAR SE O USUÁRIO É ADMIN ---
export const checkAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Primeiro, garantimos que o middleware authenticateToken rodou antes
  // e adicionou os dados do usuário ao 'req'.
  if (!req.user) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }

  // Verificamos se o perfil do usuário no token é 'ADMIN'
  if (req.user.profile !== 'ADMIN') {
    // Se não for admin, retorna um erro de "Proibido"
    return res.status(403).json({ error: 'Acesso negado: rota exclusiva para administradores.' });
  }

  // Se for admin, pode passar!
  next();
};