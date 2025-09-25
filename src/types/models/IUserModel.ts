import {
  PublicUser,
  StoredUser,
  UserFields,
} from "types/entities/userTypes.js";

export interface IUserModel {
  getUsers(): Promise<PublicUser[]>;
  findByEmail(email: string): Promise<StoredUser | null>;
  findByUsername(username: string): Promise<StoredUser | null>;
  findById(userId: string): Promise<StoredUser | null>;
  createUser(user: UserFields): Promise<PublicUser>;
  deleteUser(userId: string): Promise<boolean>;
}
