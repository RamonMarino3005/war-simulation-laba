import { Army, ArmyFields } from "types/entities/armyTypes.js";

export interface IArmyModel {
  findByUserId(ownerId: string): Promise<Army[] | null>;
  create(ownerId: string, name: ArmyFields): Promise<Army>;
  findById(armyId: string): Promise<Army | null>;
  getAll(): Promise<Army[]>;
  update(armyId: string, armyData: ArmyFields): Promise<Army | null>;
  delete(armyId: string): Promise<boolean>;
}
