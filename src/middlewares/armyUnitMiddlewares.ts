import { NextFunction, Request, Response } from "express";
import { formatError } from "../schemas/helpers.js";
import {
  createArmyUnitBodySchema,
  updateArmyUnitBodySchema,
} from "../schemas/armyUnit.js";
import { IArmyUnitMiddleware } from "types/middlewares/IArmyUnitMiddleware.js";

export class ArmyUnitMiddleware implements IArmyUnitMiddleware {
  constructor() {}

  validateCreateBody = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = createArmyUnitBodySchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    req.validatedBody = result.data as { quantity: number };

    next();
  };

  validateUpdateBody = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }
    console.log("Validating Army Unit Fields:", req.body);
    const result = updateArmyUnitBodySchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    req.validatedBody = result.data as { quantity: number };

    next();
  };
}
