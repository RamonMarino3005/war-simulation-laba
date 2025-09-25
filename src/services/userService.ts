// authService.ts
import { IUserModel } from "types/models/IUserModel.js";
import { IUserService } from "types/services/IUserService.js";
import { PublicUser } from "types/entities/userTypes.js";

export class UserService implements IUserService {
  private userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
  }

  async getUsers() {
    return this.userModel.getUsers();
  }

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

  async delete({ userId }: { userId: string }) {
    return await this.userModel.deleteUser(userId);
  }
}
