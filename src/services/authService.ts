// src/services/authService.ts (COM ROLLBACK E LOGGER)
import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import { createLog } from './logService'; 
import { UnauthorizedError, ApiError } from '../errors/api-errors'; 
import * as crypto from 'crypto'; 
import { sendWelcomeEmail } from './emailService'; 
import { logger } from '../configs/logger'; // <-- 1. Importar o logger

const prisma = new PrismaClient(); 

export const registerUser = async (data: any) => {
  
  let passwordToHash: string;
  let isTemporaryPassword = false;
  let tempPasswordForEmail: string | null = null; 

  if (data.password) {
    passwordToHash = data.password;
    isTemporaryPassword = false;
    // Substituir console.log por logger.info
    logger.info(`Registrando usuário ${data.email} com senha fornecida pelo admin.`);
  } else {
    const tempPassword = crypto.randomBytes(8).toString('hex');
    passwordToHash = tempPassword;
    isTemporaryPassword = true;
    tempPasswordForEmail = tempPassword; 
    // Substituir console.log por logger.info
    logger.info(`Senha temporária gerada para ${data.email}: ${tempPassword}`); 
  }

  const hashedPassword = await bcrypt.hash(passwordToHash, 10); 

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

  if (isTemporaryPassword && tempPasswordForEmail) {
    // --- Início da Modificação do Bloco Catch ---
    try {
      // Tenta enviar o e-mail
      await sendWelcomeEmail(user.email, user.nome, tempPasswordForEmail);
    } catch (emailError) {
      
      // 2. Substituir console.error por logger.error
      logger.error(
        emailError, 
        `FALHA CRÍTICA: E-mail não enviado para ${user.email}. Iniciando rollback...`
      );
      
      // Passo 1: Deleta o usuário que acabamos de criar.
      await prisma.user.delete({
        where: { id: user.id }
      });

      // 3. Substituir console.log por logger.warn
      logger.warn(`Rollback concluído: Usuário ${user.email} deletado.`);

      // Lança o erro para o errorMiddleware
      throw new ApiError(
        'Não foi possível criar o usuário: falha ao enviar o e-mail de confirmação.',
        500 
      );
    }
    // --- Fim da Modificação do Bloco Catch ---
  }

  await createLog({ 
    action: 'USER_REGISTERED', 
    userId: user.id, 
    details: `Novo usuário '${user.nome}' (${user.email}) criado ${isTemporaryPassword ? 'com senha temporária' : 'com senha definida pelo admin'}.`, 
  });

  const { senha_hash, ...userWithoutPassword } = user; 
  return userWithoutPassword; 
};

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