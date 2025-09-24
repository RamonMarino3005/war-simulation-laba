import express from "express";
import { AuthController } from "../controllers/authController.js";
import { AuthService } from "../services/authService.js";
import {
  extractToken,
  getSession,
  validateLogin,
  validateRegister,
} from "../middlewares/authMiddlewares.js";

export const createAuthRouter = (authService: AuthService) => {
  const router = express.Router();

  const authController = new AuthController(authService);

  router.get("/users", authController.getUsers);
  router.get(
    "/users/:id",
    extractToken,
    getSession(authService),
    authController.getUserById
  );
  //   router.get("/sign-up", authController.getSignUp);

  router.post("/sign-up", validateRegister, authController.register);

  //   router.get("/login", authController.getLogin);
  router.post("/login", validateLogin, authController.login);

  //   router.get("/logout", authController.getLogout);
  router.post(
    "/logout",
    extractToken,
    getSession(authService),
    authController.logout
  );

  router.post(
    "/delete",
    extractToken,
    getSession(authService),
    authController.deleteUser
  );

  router.post("/refresh", extractToken, authController.refresh);

  router.get("/session", extractToken, authController.getSession);

  router.get(
    "/protected",
    extractToken,
    getSession(authService),
    authController.protectedRoute
  );

  return router;
};
