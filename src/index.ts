// src/index.ts

import express from 'express';
// 1. IMPORTA as rotas de autenticação que acabamos de criar
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// 2. USA as rotas de autenticação
// O Express vai direcionar qualquer requisição que comece com '/api/auth'
// para o nosso arquivo authRoutes.
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} `);
});