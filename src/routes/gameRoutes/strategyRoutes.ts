import { StrategyController } from "../../controllers/strategyController.js";
import express from "express";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";
import { IStrategyMiddleware } from "types/middlewares/IStrategyMiddlewares.js";
import { IStrategyService } from "types/services/IStrategyService.js";

export const createStrategyRouter = (
  strategyService: IStrategyService,
  authMiddlewares: IAuthMiddleware,
  strategyMiddlewares: IStrategyMiddleware,
  parameterValidators: IParameterValidators
) => {
  const router = express.Router();

  const strategyController = new StrategyController(strategyService);

  /**
   * Strategy management routes
   */

  const { checkNumericParam } = parameterValidators;
  const { enforceAdmin, extractToken, getSession } = authMiddlewares;
  const { validateCreateBody, validateUpdateBody } = strategyMiddlewares;

  const validateStrategyIdParam = checkNumericParam("strategyId");

  router.get("/", strategyController.getAllStrategies);

  router.get(
    "/:strategyId",
    validateStrategyIdParam,
    strategyController.getStrategyById
  );

  router.use(extractToken, getSession, enforceAdmin);

  router.post(
    "/add-strategy",
    validateCreateBody,
    strategyController.addStrategy
  );

  router.put(
    "/update/:strategyId",
    validateStrategyIdParam,
    validateUpdateBody,
    strategyController.updateStrategy
  );

  router.delete(
    "/delete/:strategyId",
    validateStrategyIdParam,
    validateStrategyIdParam,
    strategyController.removeStrategy
  );

  return router;
};
