import { mockPrisma } from "./automated/mocks/prisma.mock";

jest.mock("@prisma/client", () => ({
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
    Status: {
      PENDENTE: "PENDENTE",
      EM_ANDAMENTO: "EM_ANDAMENTO",
      CONCLUIDO: "CONCLUIDO",
      CANCELADO: "CANCELADO",
    },
    Profile: {
      ADMIN: "ADMIN",
      ANALISTA: "ANALISTA",
      CHEFE: "CHEFE",
      OPERADOR_CAMPO: "OPERADOR_CAMPO",
    },
  },
}));

global.console.error = jest.fn();
