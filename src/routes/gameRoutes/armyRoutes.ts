import { ArmyController } from "../../controllers/armyController.js";
import express from "express";
import { IArmyMiddleware } from "types/middlewares/IArmyMiddleware.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IArmyService } from "types/services/IArmyService.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";

export const createArmyRouter = (
  armyService: IArmyService,
  authMiddlewares: IAuthMiddleware,
  armyMiddlewares: IArmyMiddleware,
  parameterValidators: IParameterValidators
) => {
  const router = express.Router();

  const armyController = new ArmyController(armyService);

  const { validateUUIDParam } = parameterValidators;
  const validateUUID = validateUUIDParam("id");
  const { extractToken, getSession, enforceAdmin } = authMiddlewares;
  const { validateArmyFields, validateArmyCreation } = armyMiddlewares;

  router.use(extractToken, getSession);

  router.get("/", enforceAdmin, armyController.getAllArmies);

  router.get("/:id", validateUUID, armyController.getArmyById);

  router.post("/", validateArmyCreation, armyController.createArmy);

  router.put(
    "/:id",
    validateArmyFields,
    validateUUID,
    armyController.updateArmy
  );

  router.delete("/:id", validateUUID, armyController.deleteArmy);

  router.get(
    "/user/:userId",
    validateUUIDParam("userId"),
    armyController.getArmiesByUser
  );

  return router;
};
