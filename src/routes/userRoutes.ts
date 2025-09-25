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
  const { extractToken, getSession } = authMiddlewares;

  router.use(extractToken, getSession);

  router.get("/list-users", userController.getUsers);

  router.get("/user/:id", validateUUID, userController.getUserById);

  router.post("/delete/:id", validateUUID, userController.deleteUser);

  return router;
};
