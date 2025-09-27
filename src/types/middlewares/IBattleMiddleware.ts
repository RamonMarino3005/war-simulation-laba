import { NextFunction, Request, Response } from "express";

export interface IBattleMiddleware {
  validateStartBattle: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}
