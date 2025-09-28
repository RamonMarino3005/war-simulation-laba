import { BattleMiddleware } from "../../src/middlewares/battleMiddleware.js";
import { NextFunction, Request, Response } from "express";

jest.mock("../../src/schemas/helpers.js", () => ({
  formatError: jest.fn((error) => ({ properties: { mocked: "error" } })),
}));

describe("BattleMiddleware", () => {
  let middleware: BattleMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    next = jest.fn();
    mockRes = { status: jest.fn().mockReturnValue({ json: jsonMock }) };
    middleware = new BattleMiddleware();
    mockReq = { body: {} };
  });

  describe("validateStartBattle", () => {
    it("calls next for valid body", async () => {
      mockReq.body = {
        attackerArmyId: crypto.randomUUID(),
        defenderArmyId: crypto.randomUUID(),
        location: "Battlefield",
        attackerStrategy: 1,
        defenderStrategy: 2,
      };

      await middleware.validateStartBattle(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(next).toHaveBeenCalled();
      expect(mockReq.validatedBody).toEqual(mockReq.body);
    });

    it("returns 400 if body is invalid", async () => {
      mockReq.body = {
        attackerArmyId: "not-a-uuid",
        defenderArmyId: crypto.randomUUID(),
        location: "BF",
        attackerStrategy: 1,
        defenderStrategy: 2,
      };

      await middleware.validateStartBattle(
        mockReq as Request,
        mockRes as Response,
        next
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Invalid request data",
        issues: { mocked: "error" },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
