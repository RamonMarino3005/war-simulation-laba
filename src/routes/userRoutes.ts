import express from "express";
import { UserController } from "../controllers/userController.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { IUserService } from "types/services/IUserService.js";

export const createUserRouter = (
  userService: IUserService,
  authMiddlewares: IAuthMiddleware
) => {
  const router = express.Router();

  const userController = new UserController(userService);

  const { extractToken, getSession } = authMiddlewares;

  router.use(extractToken, getSession);

  router.get("/list-users", userController.getUsers);

  router.get("/user/:id", userController.getUserById);

  router.post("/delete/:id", userController.deleteUser);

  return router;
};
