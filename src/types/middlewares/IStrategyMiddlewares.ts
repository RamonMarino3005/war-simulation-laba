import { NextFunction, Request, Response } from "express";

export interface IStrategyMiddleware {
  validateCreateBody(req: Request, res: Response, next: NextFunction): void;

  validateUpdateBody(req: Request, res: Response, next: NextFunction): void;
}
