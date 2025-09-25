import { NextFunction, Request, Response } from "express";

export interface IAuthMiddleware {
  getSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  extractToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  validateLogin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  validateRegister: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
