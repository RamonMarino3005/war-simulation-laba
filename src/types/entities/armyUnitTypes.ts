export type ArmyUnit = {
  army_id: string;
  unit_id: number;
  quantity: number;
};

export type UnitInArmy = {
  unit_type_id: number;
  quantity: number;
  type: string;
  base_health: number;
  strength: number;
  defense: number;
  cost: number;
};

export type UnitsInArmyResponse = {
  army_id: string;
  units: Array<UnitInArmy>;
};

export type UnitInArmyResponse = {
  army_id: string;
  unit: UnitInArmy | null;
};

export type UnitWithArmyAndType = {
  id: string;
  name: string;
  resources: number;
  owner_id: string;
  unit_type_id: number;
  unit_quantity_in_army: number;
  unit_cost: number;
};
