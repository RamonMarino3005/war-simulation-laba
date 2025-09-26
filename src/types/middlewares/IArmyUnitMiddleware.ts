import { NextFunction, Request, Response } from "express";

export type IArmyUnitMiddleware = {
  validateCreateBody: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  validateUpdateBody: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
};
