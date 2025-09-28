// src/services/__tests__/strategyService.test.ts
import { StrategyService } from "../strategyService.js";

describe("StrategyService", () => {
  let strategyModelMock: any;
  let service: StrategyService;

  const strategyMock = {
    id: 1,
    name: "Offensive",
    offensive_bonus: 1,
    defensive_bonus: 1,
  };

  beforeEach(() => {
    strategyModelMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new StrategyService(strategyModelMock);
  });

  describe("getAllStrategies", () => {
    it("should return all strategies", async () => {
      strategyModelMock.findAll.mockResolvedValue([strategyMock]);

      const result = await service.getAllStrategies();

      expect(result).toEqual([strategyMock]);
      expect(strategyModelMock.findAll).toHaveBeenCalled();
    });
  });

  describe("getStrategyById", () => {
    it("should return strategy by id", async () => {
      strategyModelMock.findById.mockResolvedValue(strategyMock);

      const result = await service.getStrategyById(1);
      expect(result).toEqual(strategyMock);
      expect(strategyModelMock.findById).toHaveBeenCalledWith(1);
    });

    it("should return null if not found", async () => {
      strategyModelMock.findById.mockResolvedValue(null);

      const result = await service.getStrategyById(2);
      expect(result).toBeNull();
    });
  });

  describe("addStrategy", () => {
    it("should add and return a new strategy", async () => {
      strategyModelMock.create.mockResolvedValue(strategyMock);

      const newStrategy = {
        name: "Defensive",
        offensive_bonus: 1,
        defensive_bonus: 1,
      };
      const result = await service.addStrategy(newStrategy);
      expect(result).toEqual(strategyMock);
      expect(strategyModelMock.create).toHaveBeenCalledWith(newStrategy);
    });
  });

  describe("updateStrategy", () => {
    it("should update and return the strategy", async () => {
      strategyModelMock.update.mockResolvedValue(strategyMock);

      const result = await service.updateStrategy(1, { name: "Updated" });
      expect(result).toEqual(strategyMock);
      expect(strategyModelMock.update).toHaveBeenCalledWith(1, {
        name: "Updated",
      });
    });

    it("should throw if strategy not found", async () => {
      strategyModelMock.update.mockResolvedValue(null);

      await expect(
        service.updateStrategy(99, { name: "Unknown" })
      ).rejects.toThrow("Strategy not found");
    });
  });

  describe("removeStrategy", () => {
    it("should remove and return the strategy", async () => {
      strategyModelMock.delete.mockResolvedValue(strategyMock);

      const result = await service.removeStrategy(1);
      expect(result).toEqual(strategyMock);
      expect(strategyModelMock.delete).toHaveBeenCalledWith(1);
    });

    it("should throw if strategy not found", async () => {
      strategyModelMock.delete.mockResolvedValue(null);

      await expect(service.removeStrategy(99)).rejects.toThrow(
        "Strategy not found"
      );
    });
  });
});
