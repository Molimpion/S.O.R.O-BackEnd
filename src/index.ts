// src/index.ts (COM SUPORTE A TESTES + SENTRY, PINO, PROMETHEUS E CORS)

import 'express-async-errors';

// --- 1. IMPORTAÇÕES (Sentry, Pino, Prometheus e CORS) ---
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { logger } from './configs/logger'; // O nosso logger Pino
import pinoHttp from 'pino-http'; // O logger de requisições
import promClient from 'prom-client'; // <-- NOSSA ADIÇÃO

import { env } from './configs/environment';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors'; // <--- 1. IMPORTAÇÃO DO CORS ADICIONADA

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
// Verifica se não estamos em ambiente de teste antes de iniciar o Sentry para evitar ruído nos testes
if (process.env.NODE_ENV !== 'test') {
  Sentry.init({
    dsn: env.sentry.dsn,
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Prisma(),
    ],
    tracesSampleRate: 1.0,
  });
}
// --- FIM DA INICIALIZAÇÃO DO SENTRY ---

// --- 3. INICIALIZE O PROMETHEUS ---
// Habilita as métricas padrão (uso de CPU, memória, etc.)
// Também evita inicializar durante os testes para não poluir ou causar conflitos
if (process.env.NODE_ENV !== 'test') {
  promClient.collectDefaultMetrics();
}
// --- FIM DA INICIALIZAÇÃO DO PROMETHEUS ---


const app = express();
const PORT = env.port;

// --- Configuração do Servidor HTTP e Socket.io ---
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permite qualquer origem
    methods: ["GET", "POST"],
    credentials: true // Adicione isso para garantir
  }
});

app.set('io', io);

io.on('connection', (socket: Socket) => {
  // Logs apenas se não for teste, para manter a saída dos testes limpa
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`Cliente conectado via Socket.io: ${socket.id}`);
  }
  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'test') {
      logger.info(`Cliente desconectado: ${socket.id}`);
    }
  });
});

// --- Middlewares ---
app.use(helmet());

// --- 2. CONFIGURAÇÃO DO CORS (ADICIONADO) ---
// Permite que o frontend (localhost ou produção) acesse a API sem bloqueio
app.use(cors({
  origin: '*', // Aceita requisições de qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// --- FIM DA CONFIGURAÇÃO DO CORS ---

app.use(bodyParser.json());

// --- 4. ADICIONE OS HANDLERS DO SENTRY V7 E PINO (AQUI) ---
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Logger de requisições (Pino-HTTP)
// Condicional para não logar requisições durante os testes (mantém o terminal limpo)
if (process.env.NODE_ENV !== 'test') {
  app.use(pinoHttp({ logger }));
}
// --- FIM DOS HANDLERS ---


// --- Rotas Públicas ---
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (req, res) => { res.send('API S.O.R.O. está funcionando! Acesse /api/docs para a documentação.') });
app.use('/api/v1/auth', authRoutes);

// --- 5. ADICIONAR O ENDPOINT /METRICS (PÚBLICO) ---
// Colocado aqui com as outras rotas públicas, antes da autenticação
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});
// --- FIM DO ENDPOINT /METRICS ---

// Middleware de autenticação para as rotas seguintes
app.use(authenticateToken);

// --- Rotas Protegidas ---
app.use('/api/v2/dashboard', dashboardRoutes); // Nota: vi que aqui está v2, mantive conforme seu arquivo original
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

// --- 6. AJUSTE OS MIDDLEWARES DE ERRO (NO FIM) ---

app.use(Sentry.Handlers.errorHandler());

// Middleware de tratamento de erros
app.use(errorMiddleware);
// --- FIM DOS AJUSTES DE ERRO ---


// --- 7. MODIFICAÇÃO CRÍTICA PARA TESTES: EXPORTAR APP E INICIAR CONDICIONALMENTE ---

// Exporta a instância 'app' para ser usada pelo Supertest nos testes de integração
export default app;

// Inicia o servidor APENAS se este arquivo for executado diretamente (ex: npm start)
// Se for importado por um teste (Jest), o servidor não iniciará a escuta na porta, evitando conflitos.
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    logger.info(`Documentação da API disponível em http://localhost:${PORT}/api/docs`);
    logger.info(`Métricas do Prometheus disponíveis em http://localhost:${PORT}/metrics`);
  });
}