// src/services/emailService.ts (CORRIGIDO)

// 1. Importa a configuração centralizada
import { env } from '../configs/environment';

// 2. Extrai as variáveis limpas do objeto 'env'
const brevoApiKey = env.brevo.apiKey; 
const emailFrom = env.brevo.emailFrom;

// 3. (REMOVIDO) O dotenv.config() e as validações
//     foram movidos para 'src/config/environment.ts'

// O resto do seu arquivo permanece o mesmo
const emailFromParsed = emailFrom ? emailFrom.match(/<([^>]+)>/) : null;
const senderEmail = emailFromParsed ? emailFromParsed[1] : null;
// --- CORREÇÃO AQUI (ponto e vírgula adicionado) ---
const senderName = emailFrom ? emailFrom.split('<')[0].replace(/"/g, '').trim() : null;
// --- FIM DA CORREÇÃO ---

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

  // Validação interna para garantir que o parsing do email funcionou
  if (!senderEmail || !senderName) {
    console.error('Falha ao fazer o parse do EMAIL_FROM. Verifique o formato no .env');
    throw new Error('Configuração de e-mail do remetente inválida.');
  }

  const payload = {
    sender: {
      name: senderName, // <-- O '!' não é mais necessário devido à validação acima
      email: senderEmail 
    },
    to: [
      { email: to, name: name }
    ],
    subject: subject,
    htmlContent: htmlBody
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey, 
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro da API do Brevo ao enviar e-mail para ${to}:`, errorData);
      throw new Error(`Falha na API do Brevo: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`E-mail de boas-vindas enviado para ${to} via API Brevo: ${data.messageId || 'Sucesso'}`);
  
  } catch (error) {
    console.error(`Erro crítico ao enviar e-mail de boas-vindas para ${to}:`, error);
    throw new Error('Falha ao enviar e-mail de boas-vindas.'); 
  }
};