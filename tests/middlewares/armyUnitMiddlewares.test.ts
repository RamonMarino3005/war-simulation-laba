import { ArmyUnitMiddleware } from "../../src/middlewares/armyUnitMiddlewares.js";
import { NextFunction, Request, Response } from "express";

describe("ArmyUnitMiddleware", () => {
  let middleware: ArmyUnitMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    middleware = new ArmyUnitMiddleware();
    jsonMock = jest.fn();
    next = jest.fn();

    mockRes = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    };

    mockReq = {
      body: {},
    };
  });

  describe("validateCreateBody", () => {
    it("calls next for valid body", async () => {
      mockReq.body = { quantity: 5 };

      await middleware.validateCreateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual({ quantity: 5 });
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid body", async () => {
      mockReq.body = { quantity: 0 }; // invalid, schema requires min 1

      await middleware.validateCreateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Object) })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateUpdateBody", () => {
    it("calls next for valid body", async () => {
      mockReq.body = { quantity: 5 };

      await middleware.validateUpdateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual({ quantity: 5 });
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it("returns 400 if body is empty", async () => {
      mockReq.body = {};

      await middleware.validateUpdateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith({
        error: "Request body is required",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid body", async () => {
      mockReq.body = { quantity: 0 }; // invalid

      await middleware.validateUpdateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Object) })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
