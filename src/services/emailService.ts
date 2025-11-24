// src/services/emailService.ts (Usando SendGrid)

import sgMail from '@sendgrid/mail';
import { env } from '../configs/environment';

// 1. Define a API Key para o SendGrid
sgMail.setApiKey(env.sendgrid.apiKey);

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

  // 2. Monta a mensagem para a API do SendGrid
  const msg = {
    to: {
      email: to,
      name: name,
    },
    from: env.emailFrom, // Ex: '"Sistema S.O.R.O." <verificado@seu.dominio.com>'
    subject: subject,
    html: htmlBody,
  };

  // 3. Enviar o e-mail
  try {
    await sgMail.send(msg);
    console.log(`E-mail de boas-vindas enviado para ${to} via SendGrid.`);
  } catch (error: any) {
    console.error(`Erro crítico ao enviar e-mail com SendGrid para ${to}:`, error);
    
    // Log detalhado do erro da API do SendGrid, se disponível
    if (error.response) {
      console.error(error.response.body);
    }

    // Esta falha será capturada pelo authService, que fará o rollback do usuário
    throw new Error('Falha ao enviar e-mail de boas-vindas.');
  }
};