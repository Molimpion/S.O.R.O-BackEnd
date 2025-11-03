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
// Esta rota (e a raiz) permanecem públicas e sem versão
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => { res.send('API S.O.R.O. está funcionando! Acesse /api/docs para a documentação.') });


// --- INÍCIO DA MODIFICAÇÃO (VERSIONAMENTO) ---

// Rotas de autenticação (agora com /v1/)
app.use('/api/v1/auth', authRoutes); 

// Middleware de autenticação para as rotas seguintes
app.use(authenticateToken);

// Rotas protegidas (agora com /v1/)
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/relatorios', relatorioRoutes);
app.use('/api/v1/ocorrencias', ocorrenciaRoutes);
app.use('/api/v1/users', userRoutes);

// Rotas administrativas (CRUDs de suporte) (agora com /v1/)
app.use('/api/v1/municipios', municipioRoutes); 
app.use('/api/v1/bairros', bairroRoutes);
app.use('/api/v1/naturezas', naturezaRoutes);
app.use('/api/v1/grupos', grupoRoutes);
app.use('/api/v1/subgrupos', subgrupoRoutes);
app.use('/api/v1/formas-acervo', formaAcervoRoutes);
app.use('/api/v1/grupamentos', grupamentoRoutes);
app.use('/api/v1/unidades-operacionais', unidadeOperacionalRoutes);
app.use('/api/v1/viaturas', viaturaRoutes);

// --- FIM DA MODIFICAÇÃO ---


// Middleware de tratamento de erros (deve ser o último)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação da API disponível em http://localhost:${PORT}/api/docs`);
});