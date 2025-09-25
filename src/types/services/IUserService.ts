import { PublicUser } from "types/userTypes.js";

export interface IUserService {
  getUsers(): Promise<PublicUser[]>;
  getUserById(userId: string): Promise<PublicUser | null>;
  delete({ userId }: { userId: string }): Promise<boolean>;
}
