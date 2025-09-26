import { UnitType, UnitTypeFields } from "types/entities/unitTypes.js";

export interface IUnitTypeModel {
  create(newUnitType: UnitTypeFields): Promise<UnitType>;
  findById(unitTypeId: number): Promise<UnitType | null>;
  findByType(type: string): Promise<UnitType | null>;
  getAll(): Promise<UnitType[]>;
  update(
    unitTypeId: number,
    unitTypeData: Partial<UnitTypeFields>
  ): Promise<UnitType | null>;
  delete(unitTypeId: number): Promise<boolean>;
  createEffectivenessRelation({
    attacker_unit_id,
    defender_unit_id,
    modifier,
  }: {
    attacker_unit_id: number;
    defender_unit_id: number;
    modifier: number;
  }): Promise<void>;
  updateEffectivenessRelation({
    attacker_unit_id,
    defender_unit_id,
    modifier,
  }: {
    attacker_unit_id: number;
    defender_unit_id: number;
    modifier: number;
  }): Promise<void>;
  getEffectivenessRelationsByUnitType(unitTypeId: number): Promise<
    Array<{
      attacker_unit_id: number;
      defender_unit_id: number;
      modifier: number;
    }>
  >;
  getAllEffectivenessRelations(): Promise<
    Array<{
      attacker_unit_id: number;
      defender_unit_id: number;
      modifier: number;
    }>
  >;
}
