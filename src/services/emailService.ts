// Em: src/services/emailService.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Garante que as variáveis de .env sejam carregadas

// Interface para garantir que as variáveis de ambiente necessárias existem
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

// 1. Validação das Variáveis de Ambiente (Fail Fast)
// Isso garante que a aplicação não inicie se o e-mail não estiver configurado.
const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  user: process.env.EMAIL_USER!,
  pass: process.env.EMAIL_PASS!,
  from: process.env.EMAIL_FROM!,
};

if (!emailConfig.host || !emailConfig.user || !emailConfig.pass || !emailConfig.from) {
  throw new Error('Variáveis de ambiente para configuração de e-mail não estão definidas!');
}

// 2. Criação do "Transportador" Nodemailer
// O transportador é o objeto que sabe como se conectar ao servidor SMTP
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure, // true for 465, false for other ports (like 587 with STARTTLS)
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

// 3. Função para Enviar o E-mail de Boas-Vindas
/**
 * Envia um e-mail de boas-vindas para um novo usuário com sua senha temporária.
 * @param to Email do destinatário
 * @param name Nome do novo usuário
 * @param tempPassword A senha temporária gerada (em texto plano)
 */
export const sendWelcomeEmail = async (to: string, name: string, tempPassword: string) => {
  const subject = 'Bem-vindo ao Sistema S.O.R.O!';
  const htmlBody = `
    <h1>Olá, ${name}!</h1>
    <p>Sua conta no Sistema de Ocorrências S.O.R.O. foi criada com sucesso.</p>
    <p>Utilize as seguintes credenciais para o seu primeiro acesso:</p>
    <ul>
      <li><strong>Login:</strong> ${to}</li>
      <li><strong>Senha Temporária:</strong> ${tempPassword}</li>
    </ul>
    <p><strong>Importante:</strong> Recomendamos fortemente que você altere esta senha no seu primeiro login por uma de sua preferência.</p>
    <br>
    <p>Atenciosamente,</p>
    <p>Equipe S.O.R.O.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: emailConfig.from, // Remetente
      to: to,                 // Destinatário
      subject: subject,       // Assunto
      html: htmlBody,         // Corpo do e-mail em HTML
    });

    console.log(`E-mail de boas-vindas enviado para ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de boas-vindas para ${to}:`, error);
    // Lançar o erro permite que o authService saiba que o envio falhou
    throw new Error('Falha ao enviar e-mail de boas-vindas.'); 
  }
};