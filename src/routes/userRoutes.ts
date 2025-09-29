import express from "express";
import { UserController } from "../controllers/userController.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IUserService } from "types/services/IUserService.js";
import { IParameterValidators } from "types/middlewares/IParameterValidators.js";

export const createUserRouter = (
  userService: IUserService,
  authMiddlewares: IAuthMiddleware,
  parameterValidators: IParameterValidators
) => {
  const router = express.Router();

  const userController = new UserController(userService);

  const { validateUUIDParam } = parameterValidators;
  const validateUUID = validateUUIDParam("id");
  const { extractToken, getSession, enforceAdmin } = authMiddlewares;

  router.use(extractToken, getSession);

  router.get("/", enforceAdmin, userController.getUsers);

  router.get("/:id", validateUUID, userController.getUserById);

  router.delete("/:id", validateUUID, userController.deleteUser);

  return router;
};
