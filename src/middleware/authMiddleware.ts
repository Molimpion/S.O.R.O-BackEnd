import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/api-errors";

export interface CustomRequest extends Request {
  user: {
    id: string;
    profile: string;
    unidadeOperacionalId: string | null;
  };
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    throw new ApiError("Acesso negado. Nenhum token fornecido.", 401);
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as CustomRequest["user"];
    (req as CustomRequest).user = user;
    next();
  } catch (err) {
    throw new ApiError("Token inválido.", 403);
  }
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as CustomRequest).user;

  if (user.profile !== "ADMIN") {
    throw new ApiError(
      "Acesso negado. Permissão de administrador necessária.",
      403
    );
  }
  next();
};

export const checkChefe = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as CustomRequest).user;

  if (user.profile !== "CHEFE") {
    throw new ApiError("Acesso negado. Permissão de chefe necessária.", 403);
  }
  next();
};

export const checkOperador = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as CustomRequest).user;

  if (user.profile !== "OPERADOR_CAMPO" && user.profile !== "ADMIN") {
    throw new ApiError(
      "Acesso negado. Permissão de Operador de Campo necessária.",
      403
    );
  }
  next();
};

export const authenticateAdmin = [authenticateToken, checkAdmin];
