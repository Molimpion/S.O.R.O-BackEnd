// api-tests/automated/mocks/prisma.mock.ts

// Apenas exportamos o objeto de funções mockadas
export const mockPrisma = {
  // Tabelas Principais
  user: { 
    findUnique: jest.fn(), 
    create: jest.fn(), 
    findMany: jest.fn(), 
    update: jest.fn(), 
    delete: jest.fn(), 
    findFirst: jest.fn() 
  },
  ocorrencia: { 
    findUnique: jest.fn(), 
    create: jest.fn(), 
    findMany: jest.fn(), 
    update: jest.fn(), 
    count: jest.fn(), 
    findFirst: jest.fn(),
    groupBy: jest.fn() // <-- Necessário para o Dashboard
  },
  
  // Tabelas de Apoio
  viatura: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  unidadeOperacional: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  grupamento: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  bairro: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  municipio: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  natureza: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  grupo: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  subgrupo: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  formaAcervo: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  
  // Outros
  ocorrenciaViatura: { findFirst: jest.fn() },
  auditLog: { create: jest.fn() },
  midia: { create: jest.fn() }
};