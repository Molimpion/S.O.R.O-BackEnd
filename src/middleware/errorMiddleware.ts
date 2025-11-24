// src/middleware/errorMiddleware.ts (MODIFICADO)

import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../errors/api-errors'
import { logger } from '../configs/logger' // <--- 1. IMPORTE O LOGGER

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(error); // <--- 2. REMOVA (OU COMENTE) ESTA LINHA

  const statusCode = error.statusCode ?? 500
  const message = (error.statusCode && error.message) 
    ? error.message 
    : 'Internal Server Error'

  // 3. ADICIONE O LOG ESTRUTURADO (Pino)
  // Isto irá logar o objeto de erro completo, stack trace, etc.
  logger.error(
    { 
      err: error, // Loga o objeto de erro
      statusCode: statusCode,
      path: req.path, // Adiciona contexto da rota
    }, 
    message // Mensagem principal do log
  );

  return res.status(statusCode).json({ error: message })
}