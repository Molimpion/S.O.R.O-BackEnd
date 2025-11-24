import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-errors";
import { logger } from "../configs/logger";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message =
    error.statusCode && error.message ? error.message : "Internal Server Error";

  logger.error(
    {
      err: error,
      statusCode: statusCode,
      path: req.path,
    },
    message
  );

  return res.status(statusCode).json({ error: message });
};
