import 'express-async-errors';
import { env } from './configs/environment';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authenticateToken } from './middleware/authMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './configs/swaggerConfig'; 
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

// --- 2. CRIAR O SERVIDOR HTTP E O SOCKET.IO ---
// O Express app é "embrulhado" por um servidor HTTP nativo
const httpServer = http.createServer(app); 

// O Socket.io é "ligado" ao servidor HTTP
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Para desenvolvimento. Em produção, mude para a URL do seu frontend.
    methods: ["GET", "POST"]
  }
});

// 3. Disponibiliza a instância 'io' para ser usada nas rotas/controllers
app.set('io', io);

// Ouve por novas conexões de clientes (frontends)
io.on('connection', (socket) => {
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
app.get('/', (req, res) => { res.send('API S.O.R.O. está funcionando! Acesse /api/docs para a documentação.') });
app.use('/api/v1/auth', authRoutes); 

// Middleware de autenticação para as rotas seguintes
app.use(authenticateToken);
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
app.use(errorMiddleware);

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação da API disponível em http://localhost:${PORT}/api/docs`);
});