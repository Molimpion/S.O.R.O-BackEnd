import sgMail from '@sendgrid/mail';
import { env } from '../configs/environment';
import { logger } from '../configs/logger';

sgMail.setApiKey(env.sendgrid.apiKey);

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

  const msg = {
    to: {
      email: to,
      name: name,
    },
    from: env.emailFrom, 
    subject: subject,
    html: htmlBody,
  };

  try {
    await sgMail.send(msg);
    logger.info(`E-mail de boas-vindas enviado para ${to} via SendGrid.`);
  } catch (error: any) {
    logger.error(error, `Erro crítico ao enviar e-mail com SendGrid para ${to}:`);
    
    if (error.response) {
      logger.error(error.response.body, "Detalhes do erro SendGrid:");
    }

    throw new Error('Falha ao enviar e-mail de boas-vindas.');
  }
};