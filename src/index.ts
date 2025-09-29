import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no arquivo .env');
}

import express from 'express';
import bodyParser from 'body-parser';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authenticateToken } from './middleware/authMiddleware';

import authRoutes from './routes/authRoutes';
import ocorrenciaRoutes from './routes/ocorrenciaRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// --- ROTAS PÚBLICAS ---
app.get('/', (req, res) => { res.send('API está funcionando!') });
app.use('/api/auth', authRoutes);

// --- PONTO DE CONTROLE DE AUTENTICAÇÃO ---
app.use(authenticateToken);

// --- ROTAS PROTEGIDAS ---
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/users', userRoutes);

// --- MIDDLEWARE DE ERRO ---
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});