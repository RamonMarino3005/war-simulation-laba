import { UnitTypeMiddleware } from "../unitTypeMiddleware.js";
import { Request, Response, NextFunction } from "express";

describe("UnitTypeMiddleware", () => {
  let middleware: UnitTypeMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    middleware = new UnitTypeMiddleware();
    jsonMock = jest.fn();
    next = jest.fn();
    mockRes = { status: jest.fn().mockReturnValue({ json: jsonMock }) };
    mockReq = { body: {} };
  });

  describe("validateUnitTypeFields", () => {
    it("calls next with valid body (full schema)", async () => {
      mockReq.body = {
        type: "Infantry",
        base_health: 10,
        strength: 5,
        defense: 3,
        cost: 100,
      };

      await middleware.validateUnitTypeFields(false)(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 for invalid body", async () => {
      mockReq.body = { type: "I" };

      await middleware.validateUnitTypeFields(false)(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next with partial body if partial=true", async () => {
      mockReq.body = { type: "Cavalry" };

      await middleware.validateUnitTypeFields(true)(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });
  });

  describe("validateUnitTypeCreate", () => {
    it("calls next with valid body", async () => {
      mockReq.body = {
        type: "Infantry",
        base_health: 10,
        strength: 5,
        defense: 3,
        cost: 100,
        effectiveness: [{ against: "Cavalry", attacker_modifier: 1.2 }],
      };

      await middleware.validateUnitTypeCreate(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 for invalid body", async () => {
      mockReq.body = { type: "I" };

      await middleware.validateUnitTypeCreate(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateEffectivenessArray", () => {
    it("calls next with valid array", async () => {
      mockReq.body = [
        { against: "Infantry", attacker_modifier: 1.2 },
        { against: "Cavalry" },
      ];

      await middleware.validateEffectivenessArray(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual({ effectiveness: mockReq.body });
    });

    it("returns 400 for invalid array", async () => {
      mockReq.body = [{ against: "I" }];

      await middleware.validateEffectivenessArray(
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
