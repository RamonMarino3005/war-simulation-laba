import { NextFunction, Request, Response } from "express";
import { formatError } from "../schemas/helpers.js";
import {
  effectivenessArraySchema,
  unitTypeCreateSchema,
  unitTypeSchema,
} from "../schemas/unitType.js";
import { IUnitTypeMiddleware } from "types/middlewares/IUnitTypeMiddleware.js";

export class UnitTypeMiddleware implements IUnitTypeMiddleware {
  constructor() {}

  validateUnitTypeFields = (partial = false) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parseSchema = partial ? unitTypeSchema.partial() : unitTypeSchema;

      console.log("Validating with schema:", req.body);
      const result = parseSchema.safeParse(req.body);

      console.log("Validation result:", result);
      if (!result.success) {
        res.status(400).json({ errors: formatError(result.error).properties });
        return;
      }

      req.validatedBody = result.data;
      next();
    };
  };

  validateUnitTypeCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Validate general shape
    console.log("Validating UnitTypeCreate with body:", req.body);
    const result = unitTypeCreateSchema.safeParse(req.body);
    console.log("Validation result:", result);
    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    // Attach validated body
    req.validatedBody = result.data;
    next();
  };

  validateEffectivenessArray = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const effectivenessArray = req.body;

    const result = effectivenessArraySchema.safeParse(effectivenessArray);
    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error) });
      return;
    }
    console.log("Validated effectiveness array:", result.data);
    req.validatedBody = { effectiveness: result.data };

    next();
  };
}
