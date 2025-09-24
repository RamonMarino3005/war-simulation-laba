import { NextFunction, Request, Response } from "express";
import {
  formatError,
  validateLoginSchema,
  validateUserSchema,
} from "../schemas/user.js";
import { AuthService } from "../services/authService.js";
import { UserCredentials, UserFields } from "types/userTypes.js";

export const getSession = (authService: AuthService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.token;

    if (!token) return res.status(401).json({ error: "Unauthenticated" });

    const payload = await authService.verifyToken({ token });
    if (!payload) return res.status(400).json({ error: "Invalid token" });

    req.session = { userId: payload.userId, email: payload.email };

    next();
  };
};

export const extractToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = null;

  // 1. Check auth header for API clients
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no header, try cookie for browsers
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  req.token = token;
  next();
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validateLoginSchema(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ errors: formatError(result.error).properties });
  }

  req.validatedBody = result.data as UserCredentials;

  next();
};

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validateUserSchema(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ errors: formatError(result.error).properties });
  }

  req.validatedBody = result.data as UserFields;

  next();
};
