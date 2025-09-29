import { Request, Response } from "express";
import { StoredUser } from "types/entities/userTypes.js";
import { IUserService } from "types/services/IUserService.js";

/**
 * Controller responsible for managing users.
 * Provides endpoints to list users, get user details, and delete users.
 */
export class UserController {
  constructor(private userService: IUserService) {}

  /**
   * Get all users.
   *
   * @route GET /users
   * @returns {StoredUser[]} 200 - List of all users
   */
  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  };

  /**
   * Get a specific user by ID.
   * Only the user itself or an admin can access the information.
   *
   * @route GET /users/:id
   * @param {string} id - ID of the user
   * @returns {object} 200 - User details
   * @returns {object} 403 - Forbidden if requester is not the user or admin
   * @returns {object} 404 - User not found
   * @returns {object} 500 - Error message if retrieval fails
   */
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

  /**
   * Delete a specific user by ID.
   * Only the user itself or an admin can delete a user.
   *
   * @route DELETE /users/:id
   * @param {string} id - ID of the user to delete
   * @returns {object} 200 - Deletion result
   * @returns {object} 403 - Forbidden if requester is not the user or admin
   */
  deleteUser = async (req: Request, res: Response) => {
    const session = req.session;
    const userIdToDelete = req.params.id;

    if (session.userId !== userIdToDelete && session.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await this.userService.delete({ userId: userIdToDelete });

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "User deleted successfully" });
  };
}
