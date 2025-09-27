import { NextFunction, Request, Response } from "express";
import { formatError } from "../schemas/helpers.js";
import {
  createStrategySchema,
  updateStrategySchema,
} from "../schemas/strategySchemas.js";
import { StrategyFields } from "types/entities/strategyTypes.js";
import { IStrategyMiddleware } from "types/middlewares/IStrategyMiddlewares.js";

export class StrategyMiddleware implements IStrategyMiddleware {
  constructor() {}

  validateCreateBody(req: Request, res: Response, next: NextFunction) {
    const result = createStrategySchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: formatError(result.error).properties });
    }

    req.validatedBody = result.data as StrategyFields;
    next();
  }

  validateUpdateBody(req: Request, res: Response, next: NextFunction) {
    const result = updateStrategySchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ errors: formatError(result.error).properties });
    }

    req.validatedBody = result.data as Partial<StrategyFields>;
    next();
  }
}
