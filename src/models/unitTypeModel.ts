import { DB_Controller } from "types/db/db_types.js";
import {
  EffectivenessRelation,
  UnitType,
  UnitTypeFields,
} from "types/entities/unitTypes.js";
import { IUnitTypeModel } from "types/models/IUnitTypeModel.js";

export class UnitTypeModel implements IUnitTypeModel {
  constructor(private db: DB_Controller) {}

  async create(newUnitType: UnitTypeFields): Promise<UnitType> {
    const result = await this.db.query(
      `INSERT INTO unittype (type, base_health, strength, defense, cost) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        newUnitType.type,
        newUnitType.base_health,
        newUnitType.strength,
        newUnitType.defense,
        newUnitType.cost,
      ]
    );
    const createdUnitType = result.rows[0];
    return createdUnitType;
  }

  async findById(unitTypeId: number): Promise<UnitType | null> {
    const result = await this.db.query(`SELECT * FROM unittype WHERE id = $1`, [
      unitTypeId,
    ]);
    return result.rows[0] || null;
  }

  async findByType(type: string): Promise<UnitType | null> {
    const result = await this.db.query(
      `SELECT * FROM unittype WHERE type = $1`,
      [type]
    );
    console.log("Find by type result:", result.rows);
    return result.rows[0] || null;
  }

  async getAll(): Promise<UnitType[]> {
    const result = await this.db.query(`SELECT * FROM unittype`);
    return result.rows;
  }

  async update(
    unitTypeId: number,
    updatedFields: Partial<UnitTypeFields>
  ): Promise<UnitType | null> {
    const entries = Object.entries(updatedFields);

    const values: (number | string)[] = [];
    const setClause = entries
      .map(([key, value], index) => {
        values.push(value);
        return `${key} = $${index + 1}`;
      })
      .join(", ");

    const result = await this.db.query(
      `UPDATE unittype SET ${setClause} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, unitTypeId]
    );
    return result.rows[0] || null;
  }

  async delete(unitTypeId: number): Promise<boolean> {
    const result = await this.db.query(
      `DELETE FROM unittype WHERE id = $1 RETURNING *`,
      [unitTypeId]
    );
    return result.rows.length > 0;
  }

  async createEffectivenessRelation({
    attacker_unit_id,
    defender_unit_id,
    modifier,
  }: EffectivenessRelation): Promise<void> {
    console.log("Creating effectiveness relation:", {
      attacker_unit_id,
      defender_unit_id,
      modifier,
    });
    await this.db.query(
      `INSERT INTO unitEffectiveness (attacker_unit_id, defender_unit_id, modifier) 
       VALUES ($1, $2, $3)`,
      [attacker_unit_id, defender_unit_id, modifier]
    );
  }

  async updateEffectivenessRelation({
    attacker_unit_id,
    defender_unit_id,
    modifier,
  }: EffectivenessRelation): Promise<void> {
    await this.db.query(
      `UPDATE unitEffectiveness SET modifier = $1 
       WHERE attacker_unit_id = $2 AND defender_unit_id = $3`,
      [modifier, attacker_unit_id, defender_unit_id]
    );
  }

  async getEffectivenessRelationsByUnitType(
    unitTypeId: number
  ): Promise<Array<EffectivenessRelation>> {
    const result = await this.db.query(
      `SELECT * FROM unitEffectiveness WHERE attacker_unit_id = $1 OR defender_unit_id = $1`,
      [unitTypeId]
    );
    return result.rows;
  }

  async getAllEffectivenessRelations(): Promise<Array<EffectivenessRelation>> {
    const result = await this.db.query(`SELECT * FROM unitEffectiveness`);
    console.log("All Effectiveness Relations:", result.rows);
    return result.rows;
  }
}
