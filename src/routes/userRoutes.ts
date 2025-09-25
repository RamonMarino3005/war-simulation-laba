import express from "express";
import { UserService } from "services/userService.js";
import { UserController } from "../controllers/userController.js";
import { AuthMiddleware } from "../middlewares/authMiddlewares.js";

export const createUserRouter = (
  userService: UserService,
  authMiddlewares: AuthMiddleware
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
