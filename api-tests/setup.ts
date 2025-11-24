// api-tests/setup.ts

import { mockPrisma } from './automated/mocks/prisma.mock';

// Mocka o Prisma Client GLOBALMENTE antes de qualquer teste rodar
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      meta: any;
      constructor(message: string, code: string, meta: any) {
        super(message);
        this.code = code;
        this.meta = meta;
      }
    },
    // Enums
    Status: { 
        PENDENTE: 'PENDENTE', 
        EM_ANDAMENTO: 'EM_ANDAMENTO', 
        CONCLUIDO: 'CONCLUIDO', 
        CANCELADO: 'CANCELADO' 
    },
    Profile: { 
        ADMIN: 'ADMIN', 
        ANALISTA: 'ANALISTA', 
        CHEFE: 'CHEFE' 
    }
  },
}));

// Silencia logs de erro do console durante os testes para manter o terminal limpo
global.console.error = jest.fn();