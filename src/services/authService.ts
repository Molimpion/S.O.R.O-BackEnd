// src/services/authService.ts (COM ROLLBACK E MENSAGEM DE ERRO CUSTOMIZADA)
import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import { createLog } from './logService'; 
// --- ALTERAÇÃO 1: Importar ApiError ---
import { UnauthorizedError, ApiError } from '../errors/api-errors'; 
import * as crypto from 'crypto'; 
import { sendWelcomeEmail } from './emailService'; 

const prisma = new PrismaClient(); 

// --- FUNÇÃO registerUser MODIFICADA ---
export const registerUser = async (data: any) => {
  
  let passwordToHash: string;
  let isTemporaryPassword = false;
  let tempPasswordForEmail: string | null = null; 

  // --- Lógica Condicional ---
  if (data.password) {
    // 1. Se uma senha FOI fornecida pelo admin:
    passwordToHash = data.password;
    isTemporaryPassword = false;
    console.log(`Registrando usuário ${data.email} com senha fornecida pelo admin.`);
  } else {
    // 2. Se uma senha NÃO foi fornecida: Gera temporária
    const tempPassword = crypto.randomBytes(8).toString('hex');
    passwordToHash = tempPassword;
    isTemporaryPassword = true;
    tempPasswordForEmail = tempPassword; 
    console.log(`Senha temporária gerada para ${data.email}: ${tempPassword}`); 
  }
  // --- FIM DA Lógica Condicional ---

  // 3. Faz o hash da senha escolhida
  const hashedPassword = await bcrypt.hash(passwordToHash, 10); 

  // 4. Cria o usuário no banco
  const user = await prisma.user.create({ 
    data: {
      email: data.email, 
      nome: data.name,  
      senha_hash: hashedPassword, 
      tipo_perfil: data.profile as Profile,  
      matricula: data.matricula,  
      id_unidade_operacional_fk: data.id_unidade_operacional_fk,  
    },
  });

  // --- Envia e-mail SOMENTE se for senha temporária ---
  if (isTemporaryPassword && tempPasswordForEmail) {
    try {
      // Tenta enviar o e-mail
      await sendWelcomeEmail(user.email, user.nome, tempPasswordForEmail);
    } catch (emailError) {
      
      console.error(`FALHA CRÍTICA: E-mail não enviado para ${user.email}. Iniciando rollback...`, emailError);
      
      // Passo 1: Deleta o usuário que acabamos de criar.
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.log(`Rollback concluído: Usuário ${user.email} deletado.`);

      // --- ALTERAÇÃO 2: Lançar um ApiError específico ---
      // Isto será capturado pelo errorMiddleware e enviado como JSON.
      throw new ApiError(
        'Não foi possível criar o usuário: falha ao enviar o e-mail de confirmação.',
        500 // 500 (Internal Server Error) ainda é o status correto
      );
      // --- FIM DA ALTERAÇÃO 2 ---
    }
  }
  // --- FIM DO Envio Condicional ---

  // 6. Cria o log de auditoria
  await createLog({ 
    action: 'USER_REGISTERED', 
    userId: user.id, 
    details: `Novo usuário '${user.nome}' (${user.email}) criado ${isTemporaryPassword ? 'com senha temporária' : 'com senha definida pelo admin'}.`, 
  });

  // 7. Retorna o usuário sem a senha hasheada
  const { senha_hash, ...userWithoutPassword } = user; 
  return userWithoutPassword; 
};
// --- FIM DA FUNÇÃO registerUser MODIFICADA ---

// --- FUNÇÃO loginUser MANTIDA ORIGINAL ---
export const loginUser = async (data: any) => { 
  const user = await prisma.user.findUnique({ 
    where: { email: data.email }, 
  });

  if (!user) { 
    await createLog({ 
      action: 'USER_LOGIN_FAILURE', 
      details: `Tentativa de login falhou para o email: ${data.email}. Motivo: Usuário não encontrado.`, 
    });
    throw new UnauthorizedError('Email ou senha inválidos'); 
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.senha_hash); 

  if (!isPasswordValid) { 
    await createLog({ 
      action: 'USER_LOGIN_FAILURE', 
      userId: user.id, 
      details: `Tentativa de login falhou para o usuário '${user.nome}' (${user.email}). Motivo: Senha incorreta.`, 
    });
    throw new UnauthorizedError('Email ou senha inválidos'); 
  }

  await createLog({ 
    action: 'USER_LOGIN_SUCCESS', 
    userId: user.id, 
    details: `Usuário '${user.nome}' (${user.email}) logou com sucesso.`, 
  });

  const token = jwt.sign( 
    { userId: user.id, profile: user.tipo_perfil }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: '8h' } 
  );

  const { senha_hash, ...userWithoutPassword } = user; 
  return { user: userWithoutPassword, token }; 
};
// --- FIM DA FUNÇÃO loginUser MANTIDA ORIGINAL ---