import { AuthMiddleware } from "../../src/middlewares/authMiddlewares.js";
import { IAuthService } from "types/services/IAuthService.js";
import { NextFunction, Request, Response } from "express";

describe("AuthMiddleware", () => {
  let middleware: AuthMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let authServiceMock: Partial<IAuthService>;

  beforeEach(() => {
    jsonMock = jest.fn();
    next = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };

    authServiceMock = {
      verifyToken: jest.fn(),
    };

    middleware = new AuthMiddleware(authServiceMock as IAuthService);
    mockReq = {
      headers: {},
      cookies: {},
      body: {},
    };
  });

  describe("extractToken", () => {
    it("extracts token from Authorization header", async () => {
      mockReq.headers = { authorization: "Bearer mytoken" };

      await middleware.extractToken(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockReq.token).toBe("mytoken");
      expect(next).toHaveBeenCalled();
    });

    it("extracts token from cookies if header missing", async () => {
      mockReq.cookies = { accessToken: "cookietoken" };

      await middleware.extractToken(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockReq.token).toBe("cookietoken");
      expect(next).toHaveBeenCalled();
    });

    it("returns 401 if token not found", async () => {
      await middleware.extractToken(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getSession", () => {
    it("returns 401 if no token", async () => {
      mockReq.token = null;

      await middleware.getSession(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({ error: "Unauthenticated" });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 400 if token invalid", async () => {
      mockReq.token = "token";
      (authServiceMock.verifyToken as jest.Mock).mockResolvedValue(null);

      await middleware.getSession(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({ error: "Unauthenticated" });
      expect(next).not.toHaveBeenCalled();
    });

    it("sets session and calls next for valid token", async () => {
      mockReq.token = "token";
      (authServiceMock.verifyToken as jest.Mock).mockResolvedValue({
        userId: "123",
        role: "user",
        exp: 999999,
      });

      await middleware.getSession(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockReq.session).toEqual({ userId: "123", role: "user" });
      expect(next).toHaveBeenCalled();
    });
  });

  describe("enforceAdmin", () => {
    it("calls next if session role is admin", async () => {
      mockReq.session = { role: "admin", userId: "123", email: "a" };
      await middleware.enforceAdmin(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
    });

    it("returns 403 if not admin", async () => {
      mockReq.session = { role: "user", userId: "123", email: "a" };
      await middleware.enforceAdmin(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({ error: "Forbidden" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateLogin", () => {
    it("calls next for valid body", async () => {
      mockReq.body = { email: "test@test.com", password: "12345678" };

      await middleware.validateLogin(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 for invalid body", async () => {
      mockReq.body = { email: "invalid-email", password: "12345678" };

      await middleware.validateLogin(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({
        errors: expect.any(Object),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateRegister", () => {
    it("calls next for valid body", async () => {
      mockReq.body = {
        email: "testing@test.com",
        password: "123456789",
        username: "TestUser",
      };

      await middleware.validateRegister(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 for invalid body", async () => {
      mockReq.body = { email: "invalid" };

      await middleware.validateRegister(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({
        errors: expect.any(Object),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
