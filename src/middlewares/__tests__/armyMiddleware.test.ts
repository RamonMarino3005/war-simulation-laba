import { ArmyMiddleware } from "../armyMiddlewares.js"; // adjust path
import { Request, Response, NextFunction } from "express";

describe("ArmyMiddleware", () => {
  let middleware: ArmyMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    middleware = new ArmyMiddleware();
    mockReq = {};
    jsonMock = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("validateArmyCreation", () => {
    it("calls next when army creation payload is valid", async () => {
      mockReq.body = { name: "Ramon's Army" };

      await middleware.validateArmyCreation(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
      expect((mockReq as any).validatedBody).toEqual({ name: "Ramon's Army" });
    });

    it("returns 400 when army creation payload is invalid", async () => {
      mockReq.body = { name: "A" };

      await middleware.validateArmyCreation(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Object) })
      );
    });
  });

  describe("validateArmyFields", () => {
    it("calls next when army fields are valid", async () => {
      mockReq.body = { name: "Ramon's Army", resources: 100 };

      await middleware.validateArmyFields(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
      expect((mockReq as any).validatedBody).toEqual({
        name: "Ramon's Army",
        resources: 100,
      });
    });

    it("returns 400 when army fields are invalid", async () => {
      mockReq.body = { name: "A", resources: -5 }; // invalid name & resources

      await middleware.validateArmyFields(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Object) })
      );
    });
  });
});
