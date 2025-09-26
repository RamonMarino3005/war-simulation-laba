import { ArmyUnit } from "types/entities/armyUnitTypes.js";
import { DB_Controller } from "../types/db/db_types.js";
import { IArmyUnitModel } from "types/models/IArmyUnitModel.js";

export class ArmyUnitModel implements IArmyUnitModel {
  constructor(private db: DB_Controller) {}

  async addUnitToArmy(
    armyId: string,
    unitId: number,
    quantity: number
  ): Promise<ArmyUnit | null> {
    const response = await this.db.query(
      "INSERT INTO armyunit (army_id, unit_type_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [armyId, unitId, quantity]
    );
    return response.rows[0] || null;
  }

  async updateUnitInArmy(
    armyId: string,
    unitId: number,
    quantity: number
  ): Promise<ArmyUnit | null> {
    const response = await this.db.query(
      "UPDATE armyunit SET quantity = $1 WHERE army_id = $2 AND unit_type_id = $3 RETURNING *",
      [quantity, armyId, unitId]
    );
    console.log("Update Response:", response);
    return response.rows[0] || null;
  }

  async getUnitsInArmy(armyId: string) {
    const response = await this.db.query(
      `SELECT 
      unit_type_id, 
      quantity, type, 
      base_health, 
      strength, 
      defense, 
      cost
      FROM armyunit 
      JOIN unitType ON unitType.id = armyunit.unit_type_id 
      WHERE army_id = $1`,
      [armyId]
    );
    return response.rows || null;
  }

  async getUnitInArmy(armyId: string, unitId: number) {
    const response = await this.db.query(
      `SELECT 
      unit_type_id, 
      quantity, type, 
      base_health, 
      strength, 
      defense, 
      cost
      FROM armyunit 
      JOIN unitType ON unitType.id = armyunit.unit_type_id 
      WHERE army_id = $1 AND unit_type_id = $2`,
      [armyId, unitId]
    );
    return response.rows[0] || null;
  }

  async removeAllUnitsFromArmy(
    armyId: string,
    unitId: number
  ): Promise<ArmyUnit | null> {
    const response = await this.db.query(
      "DELETE FROM armyunit WHERE army_id = $1 AND unit_type_id = $2 RETURNING *",
      [armyId, unitId]
    );
    return response.rows[0] || null;
  }

  async getUnitWithArmyAndType(armyId, unitTypeId) {
    const response = await this.db.query(
      `
    SELECT army.*,
    armyUnit.quantity AS unit_quantity_in_army,
    unitType.id AS unit_type_id,
    unitType.cost AS unit_cost
    FROM army
    JOIN armyUnit ON armyUnit.army_id = army.id
    JOIN unitType ON unitType.id = armyUnit.unit_type_id
    WHERE army.id = $1 AND armyUnit.unit_type_id = $2
  `,
      [armyId, unitTypeId]
    );
    return response.rows[0] || null;
  }
}
