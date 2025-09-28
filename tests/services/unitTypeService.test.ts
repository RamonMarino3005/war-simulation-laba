// src/services/__tests__/unitTypeService.test.ts
import { UnitType } from "../../src/types/entities/unitTypes.js";
import { UnitTypeService } from "../../src/services/unitTypeService.js";

describe("UnitTypeService", () => {
  let unitTypeModelMock: any;
  let service: UnitTypeService;

  const unitMock: UnitType = {
    id: 1,
    type: "Infantry",
    base_health: 100,
    strength: 10,
    defense: 5,
    cost: 50,
  };
  const effectivenessMock = [
    { attacker_unit_id: 1, defender_unit_id: 2, modifier: 1.2 },
  ];

  beforeEach(() => {
    unitTypeModelMock = {
      findByType: jest.fn(),
      findById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createEffectivenessRelation: jest.fn(),
      getAllEffectivenessRelations: jest.fn(),
      getEffectivenessRelationsByUnitType: jest.fn(),
      updateEffectivenessRelation: jest.fn(),
    };

    service = new UnitTypeService(unitTypeModelMock);
  });

  describe("createUnitType", () => {
    it("should create a unit type and effectiveness relations", async () => {
      unitTypeModelMock.findByType.mockResolvedValue(null);
      unitTypeModelMock.create.mockResolvedValue(unitMock);
      unitTypeModelMock.getAll.mockResolvedValue([unitMock]);

      const newUnit = { ...unitMock, effectiveness: [] };
      const result = await service.createUnitType(newUnit);

      expect(result).toEqual(unitMock);
      expect(unitTypeModelMock.create).toHaveBeenCalledWith(newUnit);
      expect(unitTypeModelMock.createEffectivenessRelation).toHaveBeenCalled();
    });

    it("should throw if type already exists", async () => {
      unitTypeModelMock.findByType.mockResolvedValue(unitMock);
      await expect(
        service.createUnitType({ ...unitMock, effectiveness: [] })
      ).rejects.toThrow("Unit Type with this type already exists");
    });

    it("should throw if provided effectiveness type does not exist", async () => {
      unitTypeModelMock.findByType.mockResolvedValue(null);
      unitTypeModelMock.create.mockResolvedValue(unitMock);
      unitTypeModelMock.getAll.mockResolvedValue([unitMock]);

      const newUnit = {
        ...unitMock,
        effectiveness: [{ against: "Unknown", attacker_modifier: 1 }],
      };

      await expect(service.createUnitType(newUnit)).rejects.toThrow(
        "Provided type Unknown does not exist"
      );
    });
  });

  describe("getUnitTypeById", () => {
    it("should return the unit type", async () => {
      unitTypeModelMock.findById.mockResolvedValue(unitMock);
      const result = await service.getUnitTypeById(1);
      expect(result).toEqual(unitMock);
    });
  });

  describe("getAllUnitTypes", () => {
    it("should return all unit types", async () => {
      unitTypeModelMock.getAll.mockResolvedValue([unitMock]);
      const result = await service.getAllUnitTypes();
      expect(result).toEqual([unitMock]);
    });
  });

  describe("updateUnitType", () => {
    it("should update the unit type", async () => {
      unitTypeModelMock.findById.mockResolvedValue(unitMock);
      unitTypeModelMock.findByType.mockResolvedValue(null);
      unitTypeModelMock.update.mockResolvedValue(unitMock);

      const result = await service.updateUnitType(1, { type: "Cavalry" });
      expect(result).toEqual(unitMock);
      expect(unitTypeModelMock.update).toHaveBeenCalledWith(1, {
        type: "Cavalry",
      });
    });

    it("should throw if unit type not found", async () => {
      unitTypeModelMock.findById.mockResolvedValue(null);
      await expect(
        service.updateUnitType(99, { type: "Cavalry" })
      ).rejects.toThrow("Unit Type not found");
    });

    it("should throw if new type already exists", async () => {
      unitTypeModelMock.findById.mockResolvedValue(unitMock);
      unitTypeModelMock.findByType.mockResolvedValue({ ...unitMock, id: 2 });

      await expect(
        service.updateUnitType(1, { type: "Infantry" })
      ).rejects.toThrow("Unit Type with this type already exists");
    });
  });

  describe("deleteUnitType", () => {
    it("should delete unit type", async () => {
      unitTypeModelMock.findById.mockResolvedValue(unitMock);
      const result = await service.deleteUnitType(1);
      expect(result).toBe(true);
      expect(unitTypeModelMock.delete).toHaveBeenCalledWith(1);
    });

    it("should throw if unit type not found", async () => {
      unitTypeModelMock.findById.mockResolvedValue(null);
      await expect(service.deleteUnitType(99)).rejects.toThrow(
        "Unit Type not found"
      );
    });
  });

  describe("createEffectivenessRelation", () => {
    it("should create effectiveness relation", async () => {
      await service.createEffectivenessRelation(1, 2, 1.5);
      expect(
        unitTypeModelMock.createEffectivenessRelation
      ).toHaveBeenCalledWith({
        attacker_unit_id: 1,
        defender_unit_id: 2,
        modifier: 1.5,
      });
    });
  });

  describe("updateUnitTypeEffectiveness", () => {
    it("should update effectiveness relations", async () => {
      unitTypeModelMock.findById.mockResolvedValue(unitMock);
      unitTypeModelMock.findByType.mockResolvedValue({ ...unitMock, id: 2 });

      await service.updateUnitTypeEffectiveness(1, [
        { against: "Infantry", attacker_modifier: 1.2, defender_modifier: 0.8 },
      ]);

      expect(
        unitTypeModelMock.updateEffectivenessRelation
      ).toHaveBeenCalledTimes(2);
    });

    it("should throw if unit type not found", async () => {
      unitTypeModelMock.findById.mockResolvedValue(null);
      await expect(service.updateUnitTypeEffectiveness(1, [])).rejects.toThrow(
        "Unit Type not found"
      );
    });

    it("should throw if target unit type not found", async () => {
      unitTypeModelMock.findById.mockResolvedValue(unitMock);
      unitTypeModelMock.findByType.mockResolvedValue(null);

      await expect(
        service.updateUnitTypeEffectiveness(1, [{ against: "Unknown" }])
      ).rejects.toThrow('Target Unit Type "Unknown" not found');
    });
  });

  describe("getAllEffectivenessRelations", () => {
    it("should return all effectiveness relations", async () => {
      unitTypeModelMock.getAllEffectivenessRelations.mockResolvedValue(
        effectivenessMock
      );

      const result = await service.getAllEffectivenessRelations();
      expect(result).toEqual(effectivenessMock);
    });
  });

  describe("getEffectivenessRelationsByUnitType", () => {
    it("should return effectiveness relations by unit type", async () => {
      unitTypeModelMock.getEffectivenessRelationsByUnitType.mockResolvedValue(
        effectivenessMock
      );

      const result = await service.getEffectivenessRelationsByUnitType(1);
      expect(result).toEqual(effectivenessMock);
      expect(
        unitTypeModelMock.getEffectivenessRelationsByUnitType
      ).toHaveBeenCalledWith(1);
    });
  });
});
