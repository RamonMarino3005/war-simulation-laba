import { NextFunction, Request, Response } from "express";

export interface IArmyMiddleware {
  validateArmyFields: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  validateArmyCreation: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
