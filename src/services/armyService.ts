import { IArmyService } from "types/services/IArmyService.js";
import { Army, ArmyFields } from "types/entities/armyTypes.js";
import { IArmyModel } from "types/models/IArmyModel.js";

const STARTING_RESOURCES = 20000;

/**
 * Service responsible for managing Army entities.
 * Handles creation, retrieval, updating, and deletion of armies.
 */
export class ArmyService implements IArmyService {
  constructor(private armyModel: IArmyModel) {}

  /**
   * Retrieves all armies belonging to a specific user.
   *
   * @param {string} userId - ID of the user
   * @returns {Promise<Army[]>} List of armies owned by the user
   */
  async getArmiesByUser(userId: string) {
    return this.armyModel.findByUserId(userId);
  }

  /**
   * Creates a new army for a user with a default starting resources.
   *
   * @param {string} userId - ID of the army owner
   * @param {string} armyName - Name of the army
   * @returns {Promise<Army>} The newly created army
   */
  async createArmy(userId: string, armyName: string): Promise<Army> {
    return this.armyModel.create(userId, {
      name: armyName,
      resources: STARTING_RESOURCES,
    });
  }

  /**
   * Retrieves a specific army by its ID.
   *
   * @param {string} armyId - ID of the army
   * @returns {Promise<Army | null>} The army or null if not found
   */
  async getArmyById(armyId: string): Promise<Army | null> {
    return this.armyModel.findById(armyId);
  }

  /**
   * Retrieves all armies in the system.
   *
   * @returns {Promise<Army[]>} List of all armies
   */
  async getAllArmies(): Promise<Army[]> {
    return this.armyModel.getAll();
  }

  /**
   * Updates an existing army.
   * Only the owner of the army can perform updates.
   *
   * @param {string} userId - ID of the user making the request
   * @param {string} armyId - ID of the army to update
   * @param {ArmyFields} armyData - Updated army data
   * @returns {Promise<Army | null>} Updated army
   * @throws Will throw an error if the army does not exist or the user is not authorized
   */
  async updateArmy(
    userId: string,
    armyId: string,
    armyData: ArmyFields
  ): Promise<Army | null> {
    const army = await this.armyModel.findById(armyId);
    if (!army) throw new Error("Army not found");

    if (army.owner_id !== userId) throw new Error("Unauthorized");

    return this.armyModel.update(armyId, armyData);
  }

  /**
   * Deletes an army.
   * Only the owner of the army can delete it.
   *
   * @param {string} userId - ID of the user requesting deletion
   * @param {string} armyId - ID of the army to delete
   * @returns {Promise<boolean>} True if deletion was successful
   * @throws Will throw an error if the army does not exist or the user is not authorized
   */
  async deleteArmy(userId: string, armyId: string): Promise<boolean> {
    const army = await this.armyModel.findById(armyId);
    if (!army) throw new Error("Army not found");
    if (army.owner_id !== userId) throw new Error("Unauthorized");

    await this.armyModel.delete(armyId);
    return true;
  }
}
