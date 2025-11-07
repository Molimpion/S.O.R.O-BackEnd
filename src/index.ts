// src/index.ts (CORRIGIDO com tipos do Socket.io)

import 'express-async-errors';
import { env } from './configs/environment';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

// --- 1. IMPORTAR 'Socket' E 'Server' ---
import http from 'http';
import { Server, Socket } from 'socket.io'; // <-- TIPO 'Socket' ADICIONADO

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

// --- 2. ADICIONAR O TIPO 'Socket' ---
io.on('connection', (socket: Socket) => { // <-- TIPO ADICIONADO AQUI
  console.log(`Cliente conectado via Socket.io: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// --- Middlewares ---
app.use(helmet()); 
app.use(bodyParser.json());

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

// Middleware de tratamento de erros
app.use(errorMiddleware);

// --- Iniciar o 'httpServer' ---
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação da API disponível em http://localhost:${PORT}/api/docs`);
});
