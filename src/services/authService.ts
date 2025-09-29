// authService.ts
import bcrypt from "bcrypt";
import { IRefreshTokenModel } from "types/models/IRefreshTokenModel.js";
import { IUserModel } from "types/models/IUserModel.js";
import { ITokenProvider } from "types/providers/ITokenProvider.js";
import { IAuthService } from "types/services/IAuthService.js";
import { UserCredentials, UserFields } from "types/entities/userTypes.js";

/**
 * Service responsible for authentication operations,
 * including registration, login, token verification,
 * refresh, and logout functionality.
 */
export class AuthService implements IAuthService {
  private userModel: IUserModel;
  private tokenProvider: ITokenProvider;
  private refreshStorage: IRefreshTokenModel;

  /**
   * Creates an instance of AuthService.
   *
   * @param userModel - User model for database operations
   * @param tokenProvider - Provider for signing and verifying tokens
   * @param refreshStorage - Storage for refresh tokens
   */
  constructor(
    userModel: IUserModel,
    tokenProvider: ITokenProvider,
    refreshStorage: IRefreshTokenModel
  ) {
    this.userModel = userModel;
    this.tokenProvider = tokenProvider;
    this.refreshStorage = refreshStorage;
  }

  /**
   * Registers a new user in the system.
   *
   * @param newUser - User details to register
   * @returns The created user
   * @throws Error if email or username is already taken
   */
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

  /**
   * Logs in a user by verifying credentials.
   * Returns an access token and a refresh token.
   *
   * @param credentials - Email and password of the user
   * @returns Object containing accessToken and refreshToken
   * @throws Error if user not found or credentials invalid
   */
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

  /**
   * Logs out a user by revoking their refresh token.
   *
   * @param userId - ID of the user to log out
   * @returns Result of the revocation operation
   */
  async logout({ userId }: { userId: string }) {
    return await this.refreshStorage.revoke(userId, "");
  }

  /**
   * Verifies a given access token.
   *
   * @param token - JWT access token
   * @returns The payload of the token if valid
   */
  async verifyToken({ token }: { token: string }) {
    return await this.tokenProvider.verify(token);
  }

  /**
   * Generates a new access token from a valid refresh token.
   *
   * @param refreshToken - JWT refresh token
   * @returns Object containing the new access token
   * @throws Error if refresh token is invalid or not recognized
   */
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

  /**
   * Creates a root admin user if none exists.
   * Uses ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
   *
   * @throws Error if environment variables are not set
   */
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
