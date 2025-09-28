import { StrategyMiddleware } from "../strategyMiddleware.js";
import { Request, Response, NextFunction } from "express";

describe("StrategyMiddleware", () => {
  let middleware: StrategyMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    middleware = new StrategyMiddleware();
    jsonMock = jest.fn();
    next = jest.fn();
    mockRes = { status: jest.fn().mockReturnValue({ json: jsonMock }) };
    mockReq = { body: {} };
  });

  describe("validateCreateBody", () => {
    it("calls next if body is valid", () => {
      mockReq.body = {
        name: "Aggressive",
        offensive_bonus: 1,
        defensive_bonus: 1,
      };

      middleware.validateCreateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 if body is invalid", () => {
      mockReq.body = { name: "A" };

      middleware.validateCreateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateUpdateBody", () => {
    it("calls next if body is valid", () => {
      mockReq.body = { name: "Defensive", offensive_bonus: 1 };

      middleware.validateUpdateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 if body is invalid", () => {
      mockReq.body = { offensive_bonus: 0 }; // below min 0.5

      middleware.validateUpdateBody(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
