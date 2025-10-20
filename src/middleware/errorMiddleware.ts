// src/middleware/errorMiddleware.ts

import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../errors/api-errors'

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Se o erro for uma instância de ApiError, use o statusCode dele.
  // Senão, use o status 500 (Internal Server Error).
  const statusCode = error.statusCode ?? 500

  // Se o erro for um ApiError (tem statusCode) E tem mensagem, usa a mensagem dele.
  // Senão, usa uma mensagem padrão para esconder detalhes de erros 500.
  const message = (error.statusCode && error.message) 
    ? error.message 
    : 'Internal Server Error'

  // Retorna o erro para o cliente
  return res.status(statusCode).json({ error: message })
}