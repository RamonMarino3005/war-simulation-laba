import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";

const idSchema = z.uuid();

export class ParameterValidators implements IParameterValidators {
  constructor() {}

  validateUUIDParam(paramName: string) {
    return (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const result = idSchema.safeParse(req.params[paramName]);

      if (!result.success) {
        res.status(400).json({ error: "Invalid ID format" }); // 👈 clean error
        return;
      }

      next();
    };
  }
}
