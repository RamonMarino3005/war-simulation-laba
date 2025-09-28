import { validateLoginSchema, validateUserSchema } from "../schemas/user.js";
import { UserCredentials, UserFields } from "types/entities/userTypes.js";
import { IAuthService } from "types/services/IAuthService.js";
import { IAuthMiddleware } from "types/middlewares/IAuthMiddleware.js";
import { NextFunction, Request, Response } from "express";
import { formatError } from "../schemas/helpers.js";

export class AuthMiddleware implements IAuthMiddleware {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  getSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.token;

    if (!token) {
      res.status(401).json({ error: "Unauthenticated" });
      return;
    }

    const payload = await this.authService.verifyToken({ token });
    if (!payload) {
      res.status(400).json({ error: "Unauthenticated" });
      return;
    }

    console.log("Verified Payload:", payload);
    const { exp, ...userData } = payload;
    req.session = userData;

    next();
  };

  extractToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = null;

    // Check auth header for API clients
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no header, try cookie for browsers
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.token = token;
    next();
  };

  enforceAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session;
    if (session.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };

  validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const result = validateLoginSchema(req.body);

    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    req.validatedBody = result.data as UserCredentials;

    next();
  };

  validateRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = validateUserSchema(req.body);

    if (!result.success) {
      res.status(400).json({ errors: formatError(result.error).properties });
      return;
    }

    req.validatedBody = result.data as UserFields;

    next();
  };
}
