// authService.ts
import bcrypt from "bcrypt";
import {
  PublicUser,
  StoredUser,
  User,
  UserCredentials,
  UserFields,
} from "types/userTypes.js";

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
  getUsers(): Promise<PublicUser[]>;
  findByEmail(email: string): Promise<StoredUser | null>;
  findByUsername(username: string): Promise<StoredUser | null>;
  createUser(user: UserFields): Promise<PublicUser>;
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

  async register(newUser: UserFields) {
    const existingEmail = await this.userModel.findByEmail(newUser.email);

    if (existingEmail)
      throw new Error("An account with this email already exists");

    const existingUsername = await this.userModel.findByUsername(
      newUser.username
    );
    if (existingUsername) throw new Error("Username is taken");

    const hashed = await bcrypt.hash(newUser.password, 10);

    return await this.userModel.createUser({
      username: newUser.username,
      email: newUser.email,
      password: hashed,
      role: newUser.role,
    });
  }

  async login(credentials: UserCredentials) {
    const user = await this.userModel.findByEmail(credentials.email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(
      credentials.password,
      user.password_hash
    );
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = await this.tokenProvider.sign({
      userId: user.user_id,
      email: user.email,
    });

    const refreshToken = await this.tokenProvider.signRefreshToken({
      userId: user.user_id,
      email: user.email,
    });

    await this.refreshStorage.save(user.user_id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout({ userId }: { userId: string }) {
    return await this.refreshStorage.revoke(userId, "");
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

  async createRootAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "No ADMIN_EMAIL or ADMIN_PASSWORD set, please set them as environment variables and restart the server"
      );
    }

    const existing = await this.userModel.findByEmail(email);
    if (!existing) {
      await this.register({
        username: "root_admin",
        email,
        password,
        role: "admin",
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  }
}
