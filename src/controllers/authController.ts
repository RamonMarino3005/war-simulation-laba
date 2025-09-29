import { Request, Response } from "express";
import { UserCredentials, UserFields } from "types/entities/userTypes.js";
import { IAuthService } from "types/services/IAuthService.js";

/**
 * Controller responsible for authentication and session management.
 *
 * Handles user registration, login, logout, token refresh, and protected route access.
 */
export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  /**
   * Registers a new user account.
   *
   * @route POST /auth/sign-up
   * @param req - Express request containing validated user fields in the body
   * @param res - Express response object
   * @returns 201 with the created user, or 400 on validation or service error
   */
  register = async (req: Request, res: Response) => {
    const newUser = req.validatedBody as UserFields;

    try {
      const user = await this.authService.register({
        ...newUser,
        role: "user",
      });
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  /**
   * Authenticates a user and issues access and refresh tokens.
   *
   * @route POST /auth/login
   * @param req - Express request containing user credentials in the body
   * @param res - Express response object
   * @returns 200 with tokens, or 300 if authentication fails
   */
  login = async (req: Request, res: Response) => {
    const credentials = req.validatedBody as UserCredentials;

    try {
      const { accessToken, refreshToken } = await this.authService.login(
        credentials
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
      res.status(300).json({ error: e.message });
    }
  };

  /**
   * Logs out a user and clears their session.
   *
   * @route POST /auth/logout
   * @param req - Express request containing the session object
   * @param res - Express response object
   * @returns 204 on successful logout
   */
  logout = async (req: Request, res: Response) => {
    const session = req.session;

    await this.authService.logout({ userId: session.userId });
    res.status(204).json({ message: "Logged out successfully" });
  };

  /**
   * Example protected route requiring authentication.
   *
   * @route GET /auth/protected
   * @param req - Express request containing the session
   * @param res - Express response object
   * @returns 200 with access confirmation and session details
   */
  protectedRoute = async (req: Request, res: Response) => {
    const session = req.session;

    res.json({ message: "Access granted to protected route", session });
  };

  /**
   * Retrieves the current user session based on a provided token.
   *
   * @route GET /auth/session
   * @param req - Express request containing `token`
   * @param res - Express response object
   * @returns 200 with authentication status and session details
   */
  getSession = async (req: Request, res: Response) => {
    const token = req.token;

    const session = await this.authService.verifyToken({ token });

    res.json({
      status: session ? "authenticated" : "unauthenticated",
      session,
    });
  };

  /**
   * Refreshes an access token using a refresh token.
   *
   * @route POST /auth/refresh
   * @param req - Express request containing a refresh token
   * @param res - Express response object
   * @returns 200 with a new access token, 401 if missing, or 403 if invalid
   */
  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.token;

    if (!refreshToken) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    try {
      const accessToken = await this.authService.refresh({ refreshToken });
      res.status(200).json(accessToken);
    } catch (e) {
      res.status(403).json({ error: e.message });
    }
  };
}
