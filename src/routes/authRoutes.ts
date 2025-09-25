import express from "express";
import { AuthController } from "../controllers/authController.js";
import { IAuthService } from "types/services/IAuthService.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";

export const createAuthRouter = (
  authService: IAuthService,
  authMiddlewares: IAuthMiddleware
) => {
  const { extractToken, getSession, validateLogin, validateRegister } =
    authMiddlewares;

  const router = express.Router();

  const authController = new AuthController(authService);

  //   router.get("/sign-up", authController.getSignUp);
  router.post("/sign-up", validateRegister, authController.register);

  //   router.get("/login", authController.getLogin);
  router.post("/login", validateLogin, authController.login);

  //   router.get("/logout", authController.getLogout);
  router.post("/logout", extractToken, getSession, authController.logout);

  router.post("/refresh", extractToken, authController.refresh);

  router.get("/session", extractToken, authController.getSession);

  router.get(
    "/protected",
    extractToken,
    getSession,
    authController.protectedRoute
  );

  return router;
};
