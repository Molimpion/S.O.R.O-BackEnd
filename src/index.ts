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
import bairroRoutes from './routes/bairroRoutes';
import naturezaRoutes from './routes/naturezaRoutes';
import grupoRoutes from './routes/grupoRoutes';
import subgrupoRoutes from './routes/subgrupoRoutes';
import formaAcervoRoutes from './routes/formaAcervoRoutes';
import grupamentoRoutes from './routes/grupamentoRoutes';
import unidadeOperacionalRoutes from './routes/unidadeOperacionalRoutes';
import viaturaRoutes from './routes/viaturaRoutes';
import relatorioRoutes from './routes/relatorioRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => { res.send('API está funcionando!') });
app.use('/api/auth', authRoutes);

app.use(authenticateToken);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bairros', bairroRoutes);
app.use('/api/naturezas', naturezaRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/subgrupos', subgrupoRoutes);
app.use('/api/formas-acervo', formaAcervoRoutes);
app.use('/api/grupamentos', grupamentoRoutes);
app.use('/api/unidades-operacionais', unidadeOperacionalRoutes);
app.use('/api/viaturas', viaturaRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});