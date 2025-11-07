// src/index.ts (CORRIGIDO para Sentry V7)

import 'express-async-errors';

// --- 1. IMPORTAÇÕES (Sentry V7 e Pino) ---
import * as Sentry from '@sentry/node';
// A V7 REQUER ESTE PACOTE SEPARADO PARA TRACING
import * as Tracing from '@sentry/tracing'; 
import { logger } from './configs/logger'; // O nosso logger Pino
import pinoHttp from 'pino-http'; // O logger de requisições
// --- FIM DAS NOVAS IMPORTAÇÕES ---

import { env } from './configs/environment';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

// --- Importações originais ---
import http from 'http';
import { Server, Socket } from 'socket.io';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authenticateToken } from './middleware/authMiddleware';

// --- Imports para o Swagger ---
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swaggerConfig'; 

// Importações das rotas
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

// --- 2. INICIALIZE O SENTRY V7 (ANTES DE "const app = express()") ---
Sentry.init({
  dsn: env.sentry.dsn,
  enabled: process.env.NODE_ENV === 'production', 
  integrations: [
    // A sintaxe da V7 usa Sentry.Integrations
    new Sentry.Integrations.Http({ tracing: true }),
    // A integração do Prisma na V7 vem do pacote @sentry/tracing
    new Tracing.Integrations.Prisma(),
  ],
  tracesSampleRate: 1.0, 
  // O profiling da V7 não é compatível da mesma forma,
  // então removemos 'profilesSampleRate' por agora.
});
// --- FIM DA INICIALIZAÇÃO DO SENTRY ---


const app = express();
const PORT = env.port; 

// --- Configuração do Servidor HTTP e Socket.io ---
const httpServer = http.createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket: Socket) => {
  logger.info(`Cliente conectado via Socket.io: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`);
  });
});

// --- Middlewares ---
app.use(helmet()); 
app.use(bodyParser.json());

// --- 3. ADICIONE OS HANDLERS DO SENTRY V7 E PINO (AQUI) ---
// A sintaxe da V7 usa Sentry.Handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Logger de requisições (Pino-HTTP)
app.use(pinoHttp({ logger }));
// --- FIM DOS HANDLERS ---


// --- Rotas Públicas ---
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =======================================================================
// ==== ROTA ADICIONADA PARA O FRONTEND (GERAR API CLIENT) ====
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// =======================================================================

app.get('/', (req, res) => { res.send('API S.O.R.O. está funcionando! Acesse /api/docs para a documentação.') });
app.use('/api/v1/auth', authRoutes); 

// Middleware de autenticação para as rotas seguintes
app.use(authenticateToken);

// --- Rotas Protegidas ---
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/relatorios', relatorioRoutes);
app.use('/api/v1/ocorrencias', ocorrenciaRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/municipios', municipioRoutes); 
app.use('/api/v1/bairros', bairroRoutes);
app.use('/api/v1/naturezas', naturezaRoutes);
app.use('/api/v1/grupos', grupoRoutes);
app.use('/api/v1/subgrupos', subgrupoRoutes);
app.use('/api/v1/formas-acervo', formaAcervoRoutes);
app.use('/api/v1/grupamentos', grupamentoRoutes);
app.use('/api/v1/unidades-operacionais', unidadeOperacionalRoutes);
app.use('/api/v1/viaturas', viaturaRoutes);

// --- 4. AJUSTE OS MIDDLEWARES DE ERRO (NO FIM) ---

// A sintaxe da V7 usa Sentry.Handlers
app.use(Sentry.Handlers.errorHandler());

// Middleware de tratamento de erros
app.use(errorMiddleware);
// --- FIM DOS AJUSTES DE ERRO ---


// --- Iniciar o 'httpServer' ---
httpServer.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  logger.info(`Documentação da API disponível em http://localhost:${PORT}/api/docs`);
});
