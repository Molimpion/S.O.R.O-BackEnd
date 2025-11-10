// src/configs/environment.ts (Atualizado para SendGrid)

import dotenv from 'dotenv';
dotenv.config();

// 1. Validação centralizada
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no arquivo .env');
}

// --- ALTERAÇÃO AQUI ---
// Removemos a validação do BREVO_API_KEY
// Adicionamos a validação do SENDGRID_API_KEY
if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
  throw new Error('Credenciais do SendGrid (SENDGRID_API_KEY, EMAIL_FROM) não definidas.');
}
// --- FIM DA ALTERAÇÃO ---

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Credenciais do Cloudinary (CLOUDINARY_...) não definidas.');
}
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não está definida no arquivo .env');
}

// 2. Exporta um objeto limpo e tipado
export const env = {
  // Configurações da Aplicação
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,
  
  // --- ALTERAÇÃO AQUI ---
  // Trocamos o objeto 'brevo' por 'sendgrid' e 'emailFrom'
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY!,
  },
  emailFrom: process.env.EMAIL_FROM!, // O e-mail verificado no SendGrid
  // --- FIM DA ALTERAÇÃO ---

  // Configurações do Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
};