import { NextFunction, Request, Response } from "express";
import { startBattleSchema } from "../schemas/battle.js";
import { formatError } from "../schemas/helpers.js";
import { IBattleMiddleware } from "types/middlewares/IBattleMiddleware.js";

export class BattleMiddleware implements IBattleMiddleware {
  constructor() {}

  async validateStartBattle(req: Request, res: Response, next: NextFunction) {
    console.log("Validating start battle:", req.body);
    const result = startBattleSchema.safeParse(req.body);
    console.log("Result:", result);
    if (!result.success) {
      res.status(400).json({
        error: "Invalid request data",
        issues: formatError(result.error).properties,
      });
      return;
    }

    req.validatedBody = result.data;

    next();
  }
}
