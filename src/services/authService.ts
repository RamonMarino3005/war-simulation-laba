// authService.ts
import bcrypt from "bcrypt";
import { User } from "types/userTypes.js";

export type Payload = {
  userId: string;
  email: string;
};
interface TokenProvider {
  sign(payload: Payload): Promise<string>;
  verify(token: string): Promise<Payload | null>;
  signRefreshToken(payload: Payload): Promise<string>;
  verifyRefreshToken(token: string): Promise<Payload | null>;
}

interface UserModel {
  getUsers(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  createUser(user: Omit<User, "id">): Promise<User>;
  deleteUser(userId: string): Promise<boolean>;
}

interface RefreshTokenRepository {
  save(userId: string, token: string): Promise<void>;
  exists(userId: string, token: string): Promise<boolean>;
  revoke(userId: string, token: string): Promise<void>;
}

export class AuthService {
  private userModel: UserModel;
  private tokenProvider: TokenProvider;
  private refreshStorage: RefreshTokenRepository;

  constructor(
    userModel: UserModel,
    tokenProvider: TokenProvider,
    refreshStorage: RefreshTokenRepository
  ) {
    this.userModel = userModel;
    this.tokenProvider = tokenProvider;
    this.refreshStorage = refreshStorage;
  }

  async getUsers() {
    return this.userModel.getUsers();
  }

  async register({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const existingEmail = await this.userModel.findByEmail(email);
    if (existingEmail)
      throw new Error("An account with this email already exists");

    const existingUsername = await this.userModel.findByUsername(username);
    if (existingUsername) throw new Error("Username is taken");

    const hashed = await bcrypt.hash(password, 10);

    return await this.userModel.createUser({
      username,
      email,
      password: hashed,
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userModel.findByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = await this.tokenProvider.sign({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = await this.tokenProvider.signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    this.refreshStorage.save(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async delete({ userId }: { userId: string }) {
    return await this.userModel.deleteUser(userId);
  }

  async verifyToken({ token }: { token: string }) {
    return await this.tokenProvider.verify(token);
  }

  async refresh({ refreshToken }: { refreshToken: string }) {
    const payload = await this.tokenProvider.verifyRefreshToken(refreshToken);
    if (!payload) throw new Error("Invalid refresh token");

    const isStored = await this.refreshStorage.exists(
      payload.userId,
      refreshToken
    );
    if (!isStored) throw new Error("Token not recognized");

    const newAccessToken = await this.tokenProvider.sign({
      userId: payload.userId,
      email: payload.email,
    });

    return { accessToken: newAccessToken };
  }
}
