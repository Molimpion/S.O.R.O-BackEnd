import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const passwordRaw = '123456';
  const passwordHash = await bcrypt.hash(passwordRaw, 10);

  const profiles: Profile[] = ['ADMIN', 'ANALISTA', 'CHEFE', 'OPERADOR_CAMPO'];

  for (const profile of profiles) {
    console.log(`\n--- Criando usuários do tipo: ${profile} ---`);
    
    for (let i = 1; i <= 5; i++) {
      const prefix = profile.substring(0, 3);
      const matricula = `${prefix}${i.toString().padStart(3, '0')}`; 
      
      const emailPrefix = profile.toLowerCase().replace('_', '');
      const email = `${emailPrefix}${i}@bombeiros.pe.gov.br`;
      
      const nome = `Usuario ${profile} ${i}`;

      const userExists = await prisma.user.findUnique({ where: { email } });

      if (!userExists) {
        await prisma.user.create({
          data: {
            nome,
            email,
            matricula,
            senha_hash: passwordHash,
            tipo_perfil: profile,
            id_unidade_operacional_fk: null 
          }
        });
        console.log(`Criado: ${nome} (${email})`);
      } else {
        console.log(`Já existe: ${email}`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error('Erro ao rodar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\nSeed finalizado!');
  });