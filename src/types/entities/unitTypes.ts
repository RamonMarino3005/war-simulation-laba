export type UnitType = {
  id: number;
  type: string;
  base_health: number;
  strength: number;
  defense: number;
  cost: number;
};

export type UnitTypeCreate = Omit<UnitType, "id"> & {
  effectiveness?: EffectivenessTableCreation;
};

export type EffectivenessTableCreation = Array<{
  against: string;
  attacker_modifier?: number;
  defender_modifier?: number;
}>;

export type EffectivenessRelation = {
  attacker_unit_id: number;
  defender_unit_id: number;
  modifier: number;
};

export type UnitTypeFields = Omit<UnitType, "id">;
