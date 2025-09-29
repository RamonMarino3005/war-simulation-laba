import express from "express";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";
import { ArmyUnitController } from "../../controllers/armyUnitController.js";
import { IArmyUnitService } from "types/services/IArmyUnitService.js";
import { IArmyUnitMiddleware } from "types/middlewares/IArmyUnitMiddleware.js";

export const createArmyUnitRouter = (
  armyUnitService: IArmyUnitService,
  authMiddlewares: IAuthMiddleware,
  armyUnitMiddlewares: IArmyUnitMiddleware,
  parameterValidators: IParameterValidators
) => {
  const router = express.Router();

  const armyController = new ArmyUnitController(armyUnitService);

  /**
   * Army unit management routes
   */

  const { validateUUIDParam, checkNumericParam } = parameterValidators;
  const { extractToken, getSession } = authMiddlewares;
  const { validateCreateBody, validateUpdateBody } = armyUnitMiddlewares;

  const validateUnitIdParam = checkNumericParam("unitId");
  const validateUUIDforArmyId = validateUUIDParam("armyId");

  router.get("/:armyId", validateUUIDforArmyId, armyController.getUnitsInArmy);

  router.get(
    "/:armyId/units/:unitId",
    validateUUIDforArmyId,
    validateUnitIdParam,
    armyController.getUnitInArmy
  );

  router.use(extractToken, getSession);

  router.put(
    "/:armyId/update/:unitId",
    validateUUIDforArmyId,
    validateUnitIdParam,
    validateUpdateBody,
    armyController.updateUnitInArmy
  );

  router.delete(
    "/:armyId/remove-unit/:unitId",
    validateUUIDforArmyId,
    validateUnitIdParam,
    armyController.removeUnitFromArmy
  );

  router.post(
    "/:armyId/add-unit/:unitId",
    validateUUIDforArmyId,
    validateUnitIdParam,
    validateCreateBody,

    armyController.addUnitToArmy
  );

  return router;
};
