import {
  PublicUser,
  UserCredentials,
  UserFields,
} from "types/entities/userTypes.js";

export type Payload = {
  userId: string;
  email: string;
  role?: "user" | "admin";
};
export type SignedPayload = Payload & { exp: number };

export interface IAuthService {
  register(newUser: UserFields): Promise<PublicUser>;
  login(
    credentials: UserCredentials
  ): Promise<{ accessToken: string; refreshToken: string }>;
  logout({ userId }: { userId: string }): Promise<void>;
  verifyToken({ token }: { token: string }): Promise<SignedPayload | null>;
  refresh({
    refreshToken,
  }: {
    refreshToken: string;
  }): Promise<{ accessToken: string }>;
  createRootAdmin(): Promise<void>;
}
