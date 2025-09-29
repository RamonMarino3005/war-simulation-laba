// authService.ts
import { IUserModel } from "types/models/IUserModel.js";
import { IUserService } from "types/services/IUserService.js";
import { PublicUser } from "types/entities/userTypes.js";

/**
 * Service responsible for managing users.
 */
export class UserService implements IUserService {
  private userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
  }

  /**
   * Retrieves all users.
   *
   * @returns Array of all users in the system
   */
  async getUsers() {
    return this.userModel.getUsers();
  }

  /**
   * Retrieves a user by their ID, returning only public information.
   *
   * @param userId - ID of the user to retrieve
   * @returns Public user data if found, otherwise null
   */
  async getUserById(userId: string): Promise<PublicUser | null> {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    return {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Deletes a user by their ID.
   *
   * @param userId - ID of the user to delete
   * @returns Result of the deletion operation
   */
  async delete({ userId }: { userId: string }) {
    return await this.userModel.deleteUser(userId);
  }
}
