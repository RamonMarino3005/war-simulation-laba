import { DB_Controller } from "types/db/db_types.js";
import { Strategy, StrategyFields } from "types/entities/strategyTypes.js";
import { IStrategyModel } from "types/models/IStrategyModel.js";

export class StrategyModel implements IStrategyModel {
  constructor(private db: DB_Controller) {}

  async findAll(): Promise<Strategy[]> {
    const strategies = await this.db.query("SELECT * FROM strategy");
    return strategies.rows;
  }

  async findById(id: number): Promise<Strategy | null> {
    const strategy = await this.db.query(
      "SELECT * FROM strategy WHERE id = $1",
      [id]
    );
    return strategy.rows[0] || null;
  }

  async create(data: StrategyFields): Promise<Strategy> {
    const strategy = await this.db.query(
      "INSERT INTO strategy (name, offensive_bonus, defensive_bonus) VALUES ($1, $2, $3) RETURNING *",
      [data.name, data.offensive_bonus, data.defensive_bonus]
    );
    return strategy.rows[0];
  }

  async update(
    id: number,
    data: Partial<StrategyFields>
  ): Promise<Strategy | null> {
    const strategy = await this.db.query(
      `UPDATE strategy SET 
          name = COALESCE($1, name),
          offensive_bonus = COALESCE($2, offensive_bonus),
          defensive_bonus = COALESCE($3, defensive_bonus)
        WHERE id = $4
        RETURNING *`,
      [data.name, data.offensive_bonus, data.defensive_bonus, id]
    );
    return strategy.rows[0] || null;
  }

  async delete(id: number): Promise<Strategy | null> {
    const strategy = await this.db.query(
      "DELETE FROM strategy WHERE id = $1 RETURNING *",
      [id]
    );
    return strategy.rows[0] || null;
  }
}
