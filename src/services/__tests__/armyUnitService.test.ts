// src/services/__tests__/armyUnitService.test.ts
import { UnitInArmy } from "types/entities/armyUnitTypes.js";
import { ArmyUnitService } from "../armyUnitService.js";

describe("ArmyUnitService", () => {
  let armyUnitModelMock: any;
  let armyServiceMock: any;
  let unitTypeServiceMock: any;
  let service: ArmyUnitService;

  const armyMock = {
    id: "army-1",
    name: "myArmy",
    resources: 100,
    owner_id: "myUser",
  };

  const armyUnitMock = {
    army_id: "army-1",
    unit_id: 1,
    unit_quantity_in_army: 10,
  };

  const unitTypeMock = {
    id: 1,
    name: "Infantry",
    cost: 50,
  };

  const unitWithArmyAndType = {
    id: "1",
    name: "myUnit",
    resources: 100,
    owner_id: "myUser",
    unit_type_id: 1,
    unit_quantity_in_army: 10,
    unit_cost: 50,
  };

  const unitInArmyMock: UnitInArmy = {
    unit_type_id: 1,
    cost: 50,
    type: "myType",
    quantity: 10,
    base_health: 100,
    strength: 20,
    defense: 10,
  };

  beforeEach(() => {
    armyUnitModelMock = {
      getUnitWithArmyAndType: jest.fn(),
      updateUnitInArmy: jest.fn(),
      addUnitToArmy: jest.fn(),
      getUnitInArmy: jest.fn(),
      getUnitsInArmy: jest.fn(),
      removeAllUnitsFromArmy: jest.fn(),
    };

    armyServiceMock = {
      getArmyById: jest.fn(),
      updateArmy: jest.fn(),
    };

    unitTypeServiceMock = {
      getUnitTypeById: jest.fn(),
    };

    service = new ArmyUnitService(
      armyUnitModelMock,
      armyServiceMock,
      unitTypeServiceMock
    );
  });

  describe("updateUnitInArmy", () => {
    it("should update unit successfully", async () => {
      armyUnitModelMock.getUnitWithArmyAndType.mockResolvedValue({
        ...unitWithArmyAndType,
        unit_quantity_in_army: 2,
      });

      armyUnitModelMock.updateUnitInArmy.mockResolvedValue({
        ...armyUnitMock,
        unit_quantity_in_army: 3,
      });
      armyServiceMock.updateArmy.mockResolvedValue({});

      const result = await service.updateUnitInArmy("army-1", 1, 1, "myUser");

      expect(result).toEqual({ ...armyUnitMock, unit_quantity_in_army: 3 });
      expect(armyUnitModelMock.updateUnitInArmy).toHaveBeenCalledWith(
        "army-1",
        1,
        3 // mocked unit_quantity_in_army + quantity being added
      );
    });

    it("should throw if army/unit not found", async () => {
      armyUnitModelMock.getUnitWithArmyAndType.mockResolvedValue(null);

      await expect(
        service.updateUnitInArmy("army-1", 1, 1, "myUser")
      ).rejects.toThrow("Army, unit type, or army unit not found");
    });

    it("should throw if user does not own army", async () => {
      armyUnitModelMock.getUnitWithArmyAndType.mockResolvedValue({
        ...unitInArmyMock,
        owner_id: "user-2",
      });

      await expect(
        service.updateUnitInArmy("army-1", 1, 1, "myUser")
      ).rejects.toThrow("User does not own this army");
    });

    it("should throw if insufficient resources", async () => {
      armyUnitModelMock.getUnitWithArmyAndType.mockResolvedValue({
        ...unitWithArmyAndType,
        resources: 0,
      });

      await expect(
        service.updateUnitInArmy("army-1", 1, 1, "myUser")
      ).rejects.toThrow("Insufficient resources in army");
    });
  });

  describe("addUnitToArmy", () => {
    it("should add a new unit", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(armyMock);
      unitTypeServiceMock.getUnitTypeById.mockResolvedValue(unitTypeMock);
      armyUnitModelMock.getUnitInArmy.mockResolvedValue(null);
      armyUnitModelMock.addUnitToArmy.mockResolvedValue({
        army_id: "army-1",
        unit_id: 1,
      });
      armyServiceMock.updateArmy.mockResolvedValue({});

      const result = await service.addUnitToArmy("army-1", 1, 1, "myUser");

      expect(armyUnitModelMock.addUnitToArmy).toHaveBeenCalledWith(
        "army-1",
        1,
        1
      );
    });

    it("should throw if quantity <= 0", async () => {
      await expect(
        service.addUnitToArmy("army-1", 1, 0, "myUser")
      ).rejects.toThrow("Quantity must be greater than zero");
    });

    it("should throw if army not found", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(null);
      await expect(
        service.addUnitToArmy("army-1", 1, 1, "myUser")
      ).rejects.toThrow("Army not found");
    });

    it("should throw if unit type not found", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(armyMock);
      unitTypeServiceMock.getUnitTypeById.mockResolvedValue(null);

      await expect(
        service.addUnitToArmy("army-1", 1, 1, "myUser")
      ).rejects.toThrow("Unit type not found");
    });
  });

  describe("getUnitsInArmy", () => {
    it("should return units", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(armyMock);
      armyUnitModelMock.getUnitsInArmy.mockResolvedValue([unitInArmyMock]);

      const result = await service.getUnitsInArmy("army-1");

      expect(result.units.length).toBe(1);
      console.log("Result_: ", result);
      expect(result.units[0]).toEqual(unitInArmyMock);
    });

    it("should throw if army not found", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(null);
      await expect(service.getUnitsInArmy("army-1")).rejects.toThrow(
        "Army not found"
      );
    });
  });

  describe("removeUnitFromArmy", () => {
    it("should remove unit successfully", async () => {
      armyUnitModelMock.getUnitWithArmyAndType.mockResolvedValue({
        ...unitWithArmyAndType,
        resources: 0,
        unit_cost: 40,
        unit_quantity_in_army: 2,
      });
      armyUnitModelMock.removeAllUnitsFromArmy.mockResolvedValue(armyUnitMock);
      armyServiceMock.updateArmy.mockResolvedValue({});

      const result = await service.removeUnitFromArmy("army-1", 1, "myUser");

      expect(result).toEqual(armyUnitMock);
      expect(armyUnitModelMock.removeAllUnitsFromArmy).toHaveBeenCalled();
      expect(armyServiceMock.updateArmy).toHaveBeenCalledWith(
        "myUser",
        "army-1",
        {
          name: "myUnit",
          resources: 80, // original resources 0 + (unit cost 40 * quantity 2)
        }
      );
    });

    it("should throw if user does not own army", async () => {
      armyUnitModelMock.getUnitWithArmyAndType.mockResolvedValue({
        ...unitInArmyMock,
        owner_id: "user-2",
      });

      await expect(
        service.removeUnitFromArmy("army-1", 1, "myUser")
      ).rejects.toThrow("User does not own this army");
    });
  });

  describe("getUnitInArmy", () => {
    it("should return unit if exists", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(armyMock);
      unitTypeServiceMock.getUnitTypeById.mockResolvedValue(unitTypeMock);
      armyUnitModelMock.getUnitInArmy.mockResolvedValue({
        army_id: "army-1",
        unit_type_id: 1,
        unit_quantity_in_army: 1,
      });

      const result = await service.getUnitInArmy("army-1", 1);
      expect(result.army_id).toBe("army-1");
      expect(result.unit.unit_type_id).toBe(1);
    });

    it("should return null if unit does not exist", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(armyMock);
      unitTypeServiceMock.getUnitTypeById.mockResolvedValue(unitTypeMock);
      armyUnitModelMock.getUnitInArmy.mockResolvedValue(null);

      const result = await service.getUnitInArmy("army-1", 1);
      expect(result).toBeNull();
    });

    it("should throw if army not found", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(null);
      await expect(service.getUnitInArmy("army-1", 1)).rejects.toThrow(
        "Army not found"
      );
    });

    it("should throw if unit type not found", async () => {
      armyServiceMock.getArmyById.mockResolvedValue(armyMock);
      unitTypeServiceMock.getUnitTypeById.mockResolvedValue(null);
      await expect(service.getUnitInArmy("army-1", 1)).rejects.toThrow(
        "Unit type not found"
      );
    });
  });
});
