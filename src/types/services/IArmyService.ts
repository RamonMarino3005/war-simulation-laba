import { Army, ArmyFields } from "types/entities/armyTypes.js";

export interface IArmyService {
  getAllArmies(): Promise<Army[]>;
  getArmyById(armyId: string): Promise<Army | null>;
  createArmy(userId: string, name: string): Promise<Army>;
  updateArmy(
    userId: string,
    armyId: string,
    armyData: ArmyFields
  ): Promise<Army | null>;
  deleteArmy(userId: string, armyId: string): Promise<boolean>;
  getArmiesByUser(userId: string): Promise<Army[]>;
}
