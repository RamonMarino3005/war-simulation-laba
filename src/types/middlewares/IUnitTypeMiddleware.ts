import { NextFunction, Request, Response } from "express";

export interface IUnitTypeMiddleware {
  validateUnitTypeFields: (
    partial?: boolean
  ) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

  validateUnitTypeCreate: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  validateEffectivenessArray: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
