import express from "express";
import { BattleController } from "../../controllers/battleController.js";
import { IBattleService } from "types/services/IBattleService.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";
import { IBattleMiddleware } from "types/middlewares/IBattleMiddleware.js";

export const createBattleRouter = (
  battleService: IBattleService,
  authMiddlewares: IAuthMiddleware,
  parameterValidators: IParameterValidators,
  battleMiddlewares: IBattleMiddleware
) => {
  const router = express.Router();

  const battleController = new BattleController(battleService);

  const { extractToken, getSession, enforceAdmin } = authMiddlewares;
  const { validateStartBattle } = battleMiddlewares;
  const { validateUUIDParam } = parameterValidators;

  router.use(extractToken, getSession);

  router.get("/", battleController.listBattles);

  router.get("/:id", validateUUIDParam("id"), battleController.getBattleById);

  router.get(
    "/report/:battleId",
    validateUUIDParam("battleId"),
    battleController.getBattleReport
  );

  router.get(
    "/army/:armyId",
    validateUUIDParam("armyId"),
    battleController.getBattlesByArmyId
  );

  router.post("/start", validateStartBattle, battleController.startBattle);

  router.use(enforceAdmin);

  router.delete("/:id", battleController.deleteBattle);

  return router;
};
