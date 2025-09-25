import { IArmyService } from "types/services/IArmyService.js";
import { Army, ArmyFields } from "types/entities/armyTypes.js";
import { IArmyModel } from "types/models/IArmyModel.js";

const STARTING_RESOURCES = 20000;

export class ArmyService implements IArmyService {
  constructor(private armyModel: IArmyModel) {}

  async getArmiesByUser(userId: string) {
    return this.armyModel.findByUserId(userId);
  }

  async createArmy(userId: string, armyName: string): Promise<Army> {
    return this.armyModel.create(userId, {
      name: armyName,
      resources: STARTING_RESOURCES,
    });
  }

  async getArmyById(armyId: string): Promise<Army | null> {
    return this.armyModel.findById(armyId);
  }

  async getAllArmies(): Promise<Army[]> {
    return this.armyModel.getAll();
  }

  async updateArmy(
    userId: string,
    armyId: string,
    armyData: ArmyFields
  ): Promise<Army | null> {
    const army = await this.armyModel.findById(armyId);
    if (!army) throw new Error("Army not found");
    console.log("Army Data:", army);
    console.log("Army Owner ID:", army.owner_id);
    console.log("Requesting User ID:", userId);
    if (army.owner_id !== userId) throw new Error("Unauthorized");

    return this.armyModel.update(armyId, armyData);
  }

  async deleteArmy(userId: string, armyId: string): Promise<boolean> {
    const army = await this.armyModel.findById(armyId);
    if (!army) throw new Error("Army not found");
    if (army.owner_id !== userId) throw new Error("Unauthorized");

    await this.armyModel.delete(armyId);
    return true;
  }
}
