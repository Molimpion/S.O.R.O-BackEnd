// src/configs/environment.ts (ATUALIZADO COM SENTRY)

import dotenv from 'dotenv';
dotenv.config();

// 1. Validação centralizada
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no arquivo .env');
}
if (!process.env.BREVO_API_KEY || !process.env.EMAIL_FROM) {
  throw new Error('Credenciais do Brevo (BREVO_API_KEY, EMAIL_FROM) não definidas.');
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Credenciais do Cloudinary (CLOUDINARY_...) não definidas.');
}
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não está definida no arquivo .env');
}

// --- ADIÇÃO PARA O SENTRY ---
// Validação do Sentry (não lança erro, apenas avisa no console)
if (!process.env.SENTRY_DSN) {
  console.warn('[AVISO] SENTRY_DSN não está definida. O rastreamento de erros está desabilitado.');
}
// --- FIM DA ADIÇÃO ---


// 2. Exporta um objeto limpo e tipado
export const env = {
  // Configurações da Aplicação
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,
  
  // Configurações do Brevo
  brevo: {
    apiKey: process.env.BREVO_API_KEY!,
    emailFrom: process.env.EMAIL_FROM!,
  },

  // Configurações do Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },

  // --- ADIÇÃO PARA O SENTRY ---
  sentry: {
    dsn: process.env.SENTRY_DSN
  }
  // --- FIM DA ADIÇÃO ---
};