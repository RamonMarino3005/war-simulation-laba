import { Request, Response } from "express";
import { IUserService } from "types/services/IUserService.js";

export class UserController {
  constructor(private userService: IUserService) {}

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  };

  getUserById = async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const requestedUserId = req.params.id;

    if (userId !== requestedUserId && req.session.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const user = await this.userService.getUserById(requestedUserId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const session = req.session;
    const userIdToDelete = req.params.id;

    if (session.userId !== userIdToDelete && session.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await this.userService.delete({ userId: userIdToDelete });

    res.status(200).json(result);
  };
}
