import express from "express";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";
import { UnitTypeController } from "../../controllers/unitTypeController.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";
import { IUnitTypeMiddleware } from "types/middlewares/IUnitTypeMiddleware.js";

export const createUnitTypeRouter = (
  unitTypeService: IUnitTypeService,
  authMiddlewares: IAuthMiddleware,
  unitTypeMiddlewares: IUnitTypeMiddleware,
  parameterValidators: IParameterValidators
) => {
  const router = express.Router();

  const unitTypeController = new UnitTypeController(unitTypeService);

  const { checkNumericParam } = parameterValidators;
  const checkNumericId = checkNumericParam("id");
  const { extractToken, getSession, enforceAdmin } = authMiddlewares;
  const {
    validateUnitTypeFields,
    validateUnitTypeCreate,
    validateEffectivenessArray,
  } = unitTypeMiddlewares;

  router.get("/", unitTypeController.getAllUnitTypes);

  router.get("/unit/:id", checkNumericId, unitTypeController.getUnitTypeById);

  router.get(
    "/list-effectiveness",
    unitTypeController.getAllEffectivenessRelations
  );

  router.get(
    "/effectiveness/:id",
    checkNumericId,
    unitTypeController.getEffectivenessRelationsByUnitType
  );

  router.use(extractToken, getSession, enforceAdmin);

  router.post(
    "/create",
    validateUnitTypeCreate,
    unitTypeController.createUnitType
  );

  router.put(
    "/update/:id",
    checkNumericId,
    validateUnitTypeFields(true),
    unitTypeController.updateUnitType
  );

  router.delete(
    "/delete/:id",
    checkNumericId,
    unitTypeController.deleteUnitType
  );

  router.put(
    "/update-effectiveness/:id",
    checkNumericId,
    validateEffectivenessArray,
    unitTypeController.updateUnitTypeEffectiveness
  );

  return router;
};
