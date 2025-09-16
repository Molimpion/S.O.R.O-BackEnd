// src/routes/authRoutes.ts

import { Router } from 'express';
import * as authController from '../controllers/authController';

// Cria uma instância do Roteador do Express
const router = Router();

// Define a rota para o cadastro de usuários.
// Quando uma requisição POST chegar em '/register',
// a função 'register' do nosso authController será executada.
router.post('/register', authController.register);

// Define a rota para o login de usuários.
// Quando uma requisição POST chegar em '/login',
// a função 'login' do nosso authController será executada.
router.post('/login', authController.login);

// Exporta o roteador com as rotas definidas
export default router;