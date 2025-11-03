// Em: src/services/emailService.ts (MODIFICADO PARA USAR A API REST DO BREVO)

import dotenv from 'dotenv';

dotenv.config(); // Garante que as variáveis de .env sejam carregadas

// 1. Validação das Variáveis de Ambiente
// Vamos usar uma variável específica para a API Key para ser mais claro
const brevoApiKey = process.env.BREVO_API_KEY; 
const emailFrom = process.env.EMAIL_FROM!; // Ex: "Sistema S.O.R.O." <seu.email@exemplo.com>

// Tenta extrair o email e o nome do EMAIL_FROM
const emailFromParsed = emailFrom ? emailFrom.match(/<([^>]+)>/) : null;
const senderEmail = emailFromParsed ? emailFromParsed[1] : null;
const senderName = emailFrom ? emailFrom.split('<')[0].replace(/"/g, '').trim() : null;

if (!brevoApiKey || !senderEmail || !senderName) {
  throw new Error('Variáveis de ambiente BREVO_API_KEY ou EMAIL_FROM (no formato "Nome" <email@exemplo.com>) não estão definidas!');
}

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

  // 2. Monta o payload para a API v3 do Brevo
  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      { email: to, name: name }
    ],
    subject: subject,
    htmlContent: htmlBody
  };

  try {
    // 3. Envia a requisição usando fetch (HTTPS, Porta 443)
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey, // <- Autentica com a API Key
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // 4. Verifica se a API do Brevo aceitou o envio
    if (!response.ok) {
      // Se o Brevo der um erro (4xx, 5xx), captura os detalhes
      const errorData = await response.json();
      console.error(`Erro da API do Brevo ao enviar e-mail para ${to}:`, errorData);
      throw new Error(`Falha na API do Brevo: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`E-mail de boas-vindas enviado para ${to} via API Brevo: ${data.messageId || 'Sucesso'}`);
  
  } catch (error) {
    console.error(`Erro crítico ao enviar e-mail de boas-vindas para ${to}:`, error);
    // Lança o erro para que o authService possa fazer o rollback
    throw new Error('Falha ao enviar e-mail de boas-vindas.'); 
  }
};