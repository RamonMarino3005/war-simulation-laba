import { randomUUID } from "crypto";
import { DB_Controller } from "../types/db/db_types.js";
import { IArmyModel } from "types/models/IArmyModel.js";
import { Army, ArmyFields } from "types/entities/armyTypes.js";

const STARTING_RESOURCES = 20000;

export class ArmyModel implements IArmyModel {
  constructor(private db: DB_Controller) {}

  async findByUserId(ownerId: string): Promise<Army[] | null> {
    const { rows } = await this.db.query(
      "SELECT * FROM army WHERE owner_id = $1",
      [ownerId]
    );
    return rows.length ? rows : null;
  }

  async create(ownerId: string, data: ArmyFields): Promise<Army> {
    const id = randomUUID();
    console.log("Name: ", data.name);
    const { rows } = await this.db.query(
      "INSERT INTO army (id, owner_id, name, resources) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, ownerId, data.name, STARTING_RESOURCES]
    );
    return rows[0];
  }

  async findById(armyId: string): Promise<Army | null> {
    const { rows } = await this.db.query("SELECT * FROM army WHERE id = $1", [
      armyId,
    ]);
    return rows.length ? rows[0] : null;
  }

  async getAll(): Promise<Army[]> {
    const { rows } = await this.db.query("SELECT * FROM army");
    return rows;
  }

  async update(armyId: string, armyData: ArmyFields): Promise<Army | null> {
    const { rows } = await this.db.query(
      "UPDATE army SET name = $1, resources = $2 WHERE id = $3 RETURNING *",
      [armyData.name, armyData.resources, armyId]
    );
    return rows.length ? rows[0] : null;
  }

  async delete(armyId: string): Promise<boolean> {
    await this.db.query("DELETE FROM army WHERE id = $1", [armyId]);
    return true;
  }
}
