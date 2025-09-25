import { NextFunction, Request, Response } from "express";
import {
  zodValidateArmyCreation,
  zodValidateArmyFields,
} from "../schemas/army.js";
import { formatError } from "../schemas/helpers.js";
import { IArmyMiddleware } from "types/middlewares/IArmyMiddleware.js";

export class ArmyMiddleware implements IArmyMiddleware {
  constructor() {}

  validateArmyCreation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Validating Army Fields:", req.body);
    const result = zodValidateArmyCreation(req.body);

    console.log("Validation Result:", result);
    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    req.validatedBody = result.data as { name: string };

    next();
  };

  validateArmyFields = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Validating Army Fields:", req.body);
    const result = zodValidateArmyFields(req.body);

    console.log("Validation Result:", result);
    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    req.validatedBody = result.data as { name: string; resources: number };

    next();
  };
}
