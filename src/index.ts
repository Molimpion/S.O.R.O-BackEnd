// src/index.ts (VERSÃO FINAL ATUALIZADA)

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

// Importações de todas as rotas
import authRoutes from './routes/authRoutes';
import ocorrenciaRoutes from './routes/ocorrenciaRoutes';
import userRoutes from './routes/userRoutes';
import municipioRoutes from './routes/municipioRoutes';
import naturezaRoutes from './routes/naturezaRoutes';
import grupoRoutes from './routes/grupoRoutes';
import subgrupoRoutes from './routes/subgrupoRoutes';
import formaAcervoRoutes from './routes/formaAcervoRoutes';
import grupamentoRoutes from './routes/grupamentoRoutes';
import unidadeOperacionalRoutes from './routes/unidadeOperacionalRoutes';
import viaturaRoutes from './routes/viaturaRoutes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// --- ROTAS PÚBLICAS ---
// (Rotas que não precisam de autenticação)
app.get('/', (req, res) => { res.send('API está funcionando!') });
app.use('/api/auth', authRoutes);

// --- PONTO DE CONTROLE DE AUTENTICAÇÃO ---
// Qualquer rota declarada abaixo desta linha precisará de um token válido.
app.use(authenticateToken);

// --- ROTAS PROTEGIDAS ---
// (Rotas que exigem autenticação)
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/users', userRoutes);
// Rotas de Classificação/Lookup (Administrativas)
app.use('/api/municipios', municipioRoutes);
app.use('/api/naturezas', naturezaRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/subgrupos', subgrupoRoutes);
app.use('/api/formas-acervo', formaAcervoRoutes);
// Rotas de Hierarquia Organizacional (Administrativas)
app.use('/api/grupamentos', grupamentoRoutes);
app.use('/api/unidades-operacionais', unidadeOperacionalRoutes);
app.use('/api/viaturas', viaturaRoutes);

// --- MIDDLEWARE DE ERRO ---
// Deve ser o último middleware a ser adicionado.
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});