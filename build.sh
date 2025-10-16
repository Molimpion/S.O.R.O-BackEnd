#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Instala todas as dependências do projeto
npm install

# 2. Gera o Prisma Client (essencial para o build do TypeScript)
# O comando 'deploy' aplica as migrações existentes sem pedir confirmação.
npx prisma migrate deploy

# 3. Executa o build do TypeScript para compilar o código para JavaScript
npm run build
