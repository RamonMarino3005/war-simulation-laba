// authService.ts
import bcrypt from "bcrypt";
import { IRefreshTokenModel } from "types/models/IRefreshTokenModel.js";
import { IUserModel } from "types/models/IUserModel.js";
import { ITokenProvider } from "types/providers/ITokenProvider.js";
import { IAuthService } from "types/services/IAuthService.js";
import { UserCredentials, UserFields } from "types/userTypes.js";

export class AuthService implements IAuthService {
  private userModel: IUserModel;
  private tokenProvider: ITokenProvider;
  private refreshStorage: IRefreshTokenModel;

  constructor(
    userModel: IUserModel,
    tokenProvider: ITokenProvider,
    refreshStorage: IRefreshTokenModel
  ) {
    this.userModel = userModel;
    this.tokenProvider = tokenProvider;
    this.refreshStorage = refreshStorage;
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
      role: user.role,
    });

    const refreshToken = await this.tokenProvider.signRefreshToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    await this.refreshStorage.save(user.user_id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout({ userId }: { userId: string }) {
    return await this.refreshStorage.revoke(userId, "");
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
