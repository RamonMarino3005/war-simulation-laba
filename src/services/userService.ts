// authService.ts
import { PublicUser, StoredUser, UserFields } from "types/userTypes.js";

interface UserModel {
  getUsers(): Promise<PublicUser[]>;
  findByEmail(email: string): Promise<StoredUser | null>;
  findByUsername(username: string): Promise<StoredUser | null>;
  findById(userId: string): Promise<StoredUser | null>;
  createUser(user: UserFields): Promise<PublicUser>;
  deleteUser(userId: string): Promise<boolean>;
}

export class UserService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
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
