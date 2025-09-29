// src/errors/api-errors.ts

// Esta é nossa classe base para todos os erros da API.
// Ela estende a classe Error padrão do Node.js.
export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Erro para requisições inválidas (ex: dados faltando no body)
export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400); // Bad Request
  }
}

// Erro para quando um recurso não é encontrado
export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404); // Not Found
  }
}

// Erro para quando o usuário não está autorizado
export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401); // Unauthorized
  }
}