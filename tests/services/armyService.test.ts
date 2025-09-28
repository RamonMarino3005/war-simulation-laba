// src/services/__tests__/armyService.test.ts
import { ArmyService } from "../../src/services/armyService.js";
import { Army } from "types/entities/armyTypes.js";

describe("ArmyService", () => {
  let armyModelMock: any;
  let armyService: ArmyService;

  const mockArmy: Army = {
    id: "army-1",
    name: "myArmy",
    resources: 20000,
    owner_id: "myUser",
  };

  beforeEach(() => {
    // Mocking the armyModel methods
    armyModelMock = {
      findByUserId: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    armyService = new ArmyService(armyModelMock);
  });

  describe("getArmiesByUser", () => {
    it("should return armies for a given user", async () => {
      armyModelMock.findByUserId.mockResolvedValue([mockArmy]);

      const result = await armyService.getArmiesByUser("myUser");

      expect(armyModelMock.findByUserId).toHaveBeenCalledWith("myUser");
      expect(result).toEqual([mockArmy]);
    });
  });

  describe("createArmy", () => {
    it("should create an army with starting resources", async () => {
      armyModelMock.create.mockResolvedValue(mockArmy);

      const result = await armyService.createArmy("myUser", "myArmy");

      expect(armyModelMock.create).toHaveBeenCalledWith("myUser", {
        name: "myArmy",
        resources: 20000,
      });
      expect(result).toEqual(mockArmy);
    });
  });

  describe("getArmyById", () => {
    it("should return army if found", async () => {
      armyModelMock.findById.mockResolvedValue(mockArmy);

      const result = await armyService.getArmyById("myArmy");

      expect(armyModelMock.findById).toHaveBeenCalledWith("myArmy");
      expect(result).toEqual(mockArmy);
    });

    it("should return null if army not found", async () => {
      armyModelMock.findById.mockResolvedValue(null);

      const result = await armyService.getArmyById("army123");

      expect(result).toBeNull();
    });
  });

  describe("getAllArmies", () => {
    it("should return all armies", async () => {
      armyModelMock.getAll.mockResolvedValue([mockArmy]);

      const result = await armyService.getAllArmies();

      expect(result).toEqual([mockArmy]);
      expect(armyModelMock.getAll).toHaveBeenCalled();
    });
  });

  describe("updateArmy", () => {
    it("should update army if user is owner", async () => {
      armyModelMock.findById.mockResolvedValue(mockArmy);
      armyModelMock.update.mockResolvedValue({ ...mockArmy, name: "Bravo" });

      const result = await armyService.updateArmy("myUser", "army-1", {
        name: "Bravo",
        resources: 20000,
      });

      expect(result.name).toBe("Bravo");
      expect(armyModelMock.update).toHaveBeenCalledWith("army-1", {
        name: "Bravo",
        resources: 20000,
      });
    });

    it("should throw error if army not found", async () => {
      armyModelMock.findById.mockResolvedValue(null);

      await expect(
        armyService.updateArmy("myUser", "army-123", {
          name: "Bravo",
          resources: 20000,
        })
      ).rejects.toThrow("Army not found");
    });

    it("should throw error if user is not owner", async () => {
      armyModelMock.findById.mockResolvedValue(mockArmy);

      await expect(
        armyService.updateArmy("not-owner", "army-1", {
          name: "Bravo",
          resources: 20000,
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("deleteArmy", () => {
    it("should delete army if user is owner", async () => {
      armyModelMock.findById.mockResolvedValue(mockArmy);
      armyModelMock.delete.mockResolvedValue(undefined);

      const result = await armyService.deleteArmy("myUser", "army-1");

      expect(result).toBe(true);
      expect(armyModelMock.delete).toHaveBeenCalledWith("army-1");
    });

    it("should throw error if army not found", async () => {
      armyModelMock.findById.mockResolvedValue(null);

      await expect(
        armyService.deleteArmy("myUser", "army-123")
      ).rejects.toThrow("Army not found");
    });

    it("should throw error if user is not owner", async () => {
      armyModelMock.findById.mockResolvedValue(mockArmy);

      await expect(armyService.deleteArmy("user-2", "army-1")).rejects.toThrow(
        "Unauthorized"
      );
    });
  });
});
