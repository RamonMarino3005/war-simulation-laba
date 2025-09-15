import { Request, Response } from "express";
import { AuthService } from "../services/authService.js";
import { UserCredentials, UserFields } from "types/userTypes.js";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // Debugging purposes.
  getUsers = async (req: Request, res: Response) => {
    const users = await this.authService.getUsers();
    res.status(200).json(users);
  };

  register = async (req: Request, res: Response) => {
    const newUser = req.validatedBody as UserFields;

    try {
      const user = await this.authService.register(newUser);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

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

  deleteUser = async (req: Request, res: Response) => {
    const user = req.user;

    const result = await this.authService.delete({ userId: user.userId });

    console.log("Result:", result);
    res.status(200).json(result);
  };

  protectedRoute = async (req: Request, res: Response) => {
    const user = req.user;

    res.json({ message: "Access granted to protected route", user });
  };

  getSession = async (req: Request, res: Response) => {
    const token = req.token;

    const session = await this.authService.verifyToken({ token });

    res.json({
      status: session ? "authenticated" : "unauthenticated",
      session,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.token;

    if (!refreshToken) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    try {
      const accessToken = await this.authService.refresh({ refreshToken });
      console.log(accessToken);
      res.status(200).json(accessToken);
    } catch (e) {
      res.status(403).json({ error: e.message });
    }
  };
}
