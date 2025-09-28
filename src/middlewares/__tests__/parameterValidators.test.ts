import { ParameterValidators } from "../parameterValidators.js";
import { Request, Response, NextFunction } from "express";

describe("ParameterValidators", () => {
  let middleware: ParameterValidators;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    middleware = new ParameterValidators();
    jsonMock = jest.fn();
    next = jest.fn();
    mockRes = { status: jest.fn().mockReturnValue({ json: jsonMock }) };
    mockReq = { params: {} };
  });

  describe("validateUUIDParam", () => {
    const paramName = "id";

    it("calls next if UUID param is valid", async () => {
      mockReq.params![paramName] = crypto.randomUUID();

      const validator = middleware.validateUUIDParam(paramName);
      await validator(mockReq as Request, mockRes as Response, next);

      expect(next).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it("returns 400 if UUID param is invalid", async () => {
      mockReq.params![paramName] = "invalid-uuid";

      const validator = middleware.validateUUIDParam(paramName);
      await validator(mockReq as Request, mockRes as Response, next);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Invalid ID format" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("checkNumericParam", () => {
    const paramName = "amount";

    it("calls next if param is numeric", () => {
      mockReq.params![paramName] = "42";

      const validator = middleware.checkNumericParam(paramName);
      validator(mockReq as Request, mockRes as Response, next);

      expect(next).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it("returns 400 if param is not numeric", () => {
      mockReq.params![paramName] = "not-a-number";

      const validator = middleware.checkNumericParam(paramName);
      validator(mockReq as Request, mockRes as Response, next);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: `Invalid ${paramName}` });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
