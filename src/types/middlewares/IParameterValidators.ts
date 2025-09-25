import { NextFunction, Request, Response } from "express";

export interface IParameterValidators {
  validateUUIDParam(
    paramName: string
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
