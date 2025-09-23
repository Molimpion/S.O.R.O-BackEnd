// src/index.ts
import dotenv from 'dotenv';
dotenv.config();  

import express from 'express';
import authRoutes from './routes/auth.Routes';
import ocorrenciaRoutes from './routes/ocorrencia.Routes';
import userRoutes from './routes/user.Routes'; 

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