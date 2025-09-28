// src/services/__tests__/authService.test.ts
import bcrypt from "bcrypt";
import { AuthService } from "../../src/services/authService.js";

describe("AuthService", () => {
  let userModelMock: any;
  let tokenProviderMock: any;
  let refreshStorageMock: any;
  let service: AuthService;

  const userMock = {
    user_id: "user-1",
    email: "test@example.com",
    username: "testuser",
    password_hash: "$2b$10$hashedpassword",
    role: "user",
  };

  beforeEach(() => {
    userModelMock = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      createUser: jest.fn(),
    };

    tokenProviderMock = {
      sign: jest.fn(),
      signRefreshToken: jest.fn(),
      verify: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    refreshStorageMock = {
      save: jest.fn(),
      revoke: jest.fn(),
      exists: jest.fn(),
    };

    service = new AuthService(
      userModelMock,
      tokenProviderMock,
      refreshStorageMock
    );
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      userModelMock.findByEmail.mockResolvedValue(null);
      userModelMock.findByUsername.mockResolvedValue(null);

      const newUser = {
        username: "newuser",
        email: "new@example.com",
        password: "pass123",
        role: "user" as "user" | "admin",
      };

      userModelMock.createUser.mockResolvedValue({
        ...newUser,
        password: "hashed",
      });

      const result = await service.register(newUser);
      console.log("result: ", result);
      expect(result.email).toBe(newUser.email);
      expect(userModelMock.createUser).toHaveBeenCalled();
    });

    it("should throw if email exists", async () => {
      userModelMock.findByEmail.mockResolvedValue(userMock);
      await expect(
        service.register({
          username: "x",
          email: "test@example.com",
          password: "123",
          role: "user",
        })
      ).rejects.toThrow("An account with this email already exists");
    });

    it("should throw if username exists", async () => {
      userModelMock.findByEmail.mockResolvedValue(null);
      userModelMock.findByUsername.mockResolvedValue(userMock);
      await expect(
        service.register({
          username: "testuser",
          email: "other@example.com",
          password: "123",
          role: "user",
        })
      ).rejects.toThrow("Username is taken");
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      userModelMock.findByEmail.mockResolvedValue(userMock);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      tokenProviderMock.sign.mockResolvedValue("accessToken");
      tokenProviderMock.signRefreshToken.mockResolvedValue("refreshToken");
      refreshStorageMock.save.mockResolvedValue(true);

      const credentials = { email: "test@example.com", password: "pass123" };
      const result = await service.login(credentials);

      expect(result).toEqual({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });
      expect(tokenProviderMock.sign).toHaveBeenCalled();
      expect(tokenProviderMock.signRefreshToken).toHaveBeenCalled();
      expect(refreshStorageMock.save).toHaveBeenCalled();
    });

    it("should throw if user not found", async () => {
      userModelMock.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: "noone@example.com", password: "123" })
      ).rejects.toThrow("User not found");
    });

    it("should throw if password is invalid", async () => {
      userModelMock.findByEmail.mockResolvedValue(userMock);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(
        service.login({ email: "test@example.com", password: "wrong" })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("logout", () => {
    it("should call refreshStorage.revoke", async () => {
      refreshStorageMock.revoke.mockResolvedValue(true);

      const result = await service.logout({ userId: "user-1" });
      expect(refreshStorageMock.revoke).toHaveBeenCalledWith("user-1", "");
      expect(result).toBe(true);
    });
  });

  describe("verifyToken", () => {
    it("should call tokenProvider.verify", async () => {
      tokenProviderMock.verify.mockResolvedValue({ userId: "user-1" });

      const result = await service.verifyToken({ token: "token" });
      expect(tokenProviderMock.verify).toHaveBeenCalledWith("token");
      expect(result.userId).toBe("user-1");
    });
  });

  describe("refresh", () => {
    it("should refresh access token", async () => {
      tokenProviderMock.verifyRefreshToken.mockResolvedValue({
        userId: "user-1",
        email: "test@example.com",
      });
      refreshStorageMock.exists.mockResolvedValue(true);
      tokenProviderMock.sign.mockResolvedValue("newAccessToken");

      const result = await service.refresh({ refreshToken: "refreshToken" });
      expect(result).toEqual({ accessToken: "newAccessToken" });
    });

    it("should throw if refresh token invalid", async () => {
      tokenProviderMock.verifyRefreshToken.mockResolvedValue(null);
      await expect(
        service.refresh({ refreshToken: "badToken" })
      ).rejects.toThrow("Invalid refresh token");
    });

    it("should throw if token not recognized", async () => {
      tokenProviderMock.verifyRefreshToken.mockResolvedValue({
        userId: "user-1",
        email: "test@example.com",
      });
      refreshStorageMock.exists.mockResolvedValue(false);
      await expect(
        service.refresh({ refreshToken: "refreshToken" })
      ).rejects.toThrow("Token not recognized");
    });
  });

  describe("createRootAdmin", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      process.env = {
        ...OLD_ENV,
        ADMIN_EMAIL: "admin@example.com",
        ADMIN_PASSWORD: "rootpass",
      };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it("should create admin if not exists", async () => {
      userModelMock.findByEmail.mockResolvedValue(null);
      jest.spyOn(service, "register").mockResolvedValue({
        user_id: "admin-1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      });

      await service.createRootAdmin();
      expect(service.register).toHaveBeenCalled();
    });

    it("should not create admin if already exists", async () => {
      userModelMock.findByEmail.mockResolvedValue({
        ...userMock,
        role: "admin",
      });
      const spy = jest.spyOn(console, "log").mockImplementation(() => {});

      await service.createRootAdmin();
      expect(spy).toHaveBeenCalledWith("Admin user already exists");
      spy.mockRestore();
    });

    it("should throw if env vars missing", async () => {
      process.env.ADMIN_EMAIL = "";
      process.env.ADMIN_PASSWORD = "";
      await expect(service.createRootAdmin()).rejects.toThrow(
        "No ADMIN_EMAIL or ADMIN_PASSWORD set, please set them as environment variables and restart the server"
      );
    });
  });
});
