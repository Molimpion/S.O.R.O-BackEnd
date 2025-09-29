// src/index.ts (REFATORADO)

import 'express-async-errors'; // Garante que o middleware de erro funcione com async
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no arquivo .env');
}

import express from 'express';
import { errorMiddleware } from './middleware/error.Middleware';
import { authenticateToken } from './middleware/auth.Middleware'; // 1. IMPORTAMOS O AUTHENTICATE

// Importa todas as rotas
import authRoutes from './routes/auth.Routes';
import ocorrenciaRoutes from './routes/ocorrencia.Routes';
import userRoutes from './routes/user.Routes';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- ROTAS PÚBLICAS ---
// Estas rotas não precisam de token, então vêm ANTES do middleware de autenticação.
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});
app.use('/api/auth', authRoutes);


// --- PONTO DE CONTROLE DE AUTENTICAÇÃO ---
// 2. APLICAMOS O MIDDLEWARE GLOBALMENTE
// Qualquer rota declarada ABAIXO desta linha, precisará de um token válido.
app.use(authenticateToken);


// --- ROTAS PROTEGIDAS ---
// Estas rotas agora estão automaticamente protegidas pelo 'authenticateToken'.
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/users', userRoutes);


// --- MIDDLEWARE DE ERRO ---
// Deve ser o último middleware.
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} `);
});