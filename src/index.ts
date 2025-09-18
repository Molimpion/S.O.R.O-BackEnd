// src/index.ts

import express from 'express';
import authRoutes from './routes/authRoutes';
import ocorrenciaRoutes from './routes/ocorrenciaRoutes';
import userRoutes from './routes/userRoutes'; 

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// Rotas de Autenticação (Públicas)
app.use('/api/auth', authRoutes);

// Rotas de Ocorrências (Protegidas, mas ainda esqueleto)
app.use('/api/ocorrencias', ocorrenciaRoutes);

// Rotas de Gestão de Usuários (Protegidas para Admins)
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); 
});