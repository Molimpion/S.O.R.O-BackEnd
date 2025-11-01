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

// --- Imports para o Swagger ---
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig'; // Importa nossa configuração
// --- Fim dos imports do Swagger ---

// Importações das rotas existentes
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
import municipioRoutes from './routes/municipioRoutes'; 

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());

// --- Rota da Documentação (Swagger) ---
// Esta rota deve ser pública
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota pública
app.get('/', (req, res) => { res.send('API S.O.R.O. está funcionando! Acesse /api/docs para a documentação.') });
app.use('/api/auth', authRoutes); // Rotas de autenticação são públicas

// Middleware de autenticação para as rotas seguintes
app.use(authenticateToken);

// Rotas protegidas
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/users', userRoutes);

// Rotas administrativas (CRUDs de suporte)
app.use('/api/municipios', municipioRoutes); 
app.use('/api/bairros', bairroRoutes);
app.use('/api/naturezas', naturezaRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/subgrupos', subgrupoRoutes);
app.use('/api/formas-acervo', formaAcervoRoutes);
app.use('/api/grupamentos', grupamentoRoutes);
app.use('/api/unidades-operacionais', unidadeOperacionalRoutes);
app.use('/api/viaturas', viaturaRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação da API disponível em http://localhost:${PORT}/api/docs`);
});