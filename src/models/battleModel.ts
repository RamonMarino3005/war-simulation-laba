import { DB_Controller } from "types/db/db_types.js";
import { Battle, BattleArmy } from "types/entities/battleTypes.js";
import { IBattleModel } from "types/models/IBattleModel.js";

export class BattleModel implements IBattleModel {
  constructor(private db: DB_Controller) {}

  async createBattle(location: string): Promise<any> {
    const id = crypto.randomUUID();
    const date = new Date().toISOString();

    const response = await this.db.query(
      "INSERT INTO battle (id, location, date) VALUES ($1, $2, $3) RETURNING *",
      [id, location, date]
    );
    return response.rows[0];
  }

  async createBattleArmy(
    battleId: string,
    army_id: string,
    strategy_id: number,
    role: "attacker" | "defender",
    outcome: "won" | "lost",
    starting_strength,
    final_strength,
    casualties
  ): Promise<any> {
    const response = await this.db.query(
      "INSERT INTO battleArmy (battle_id, army_id, strategy_id, role, outcome, starting_strength, final_strength, casualties) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        battleId,
        army_id,
        strategy_id,
        role,
        outcome,
        starting_strength,
        final_strength,
        casualties,
      ]
    );
    return response.rows[0];
  }

  async findAll(): Promise<Battle[]> {
    const response = await this.db.query("SELECT * FROM battle");
    return response.rows;
  }

  async findById(battleId: string): Promise<Battle | null> {
    const response = await this.db.query("SELECT * FROM battle WHERE id = $1", [
      battleId,
    ]);
    return response.rows[0] || null;
  }

  async findByArmyId(armyId: string): Promise<(BattleArmy & Battle)[]> {
    const response = await this.db.query(
      `SELECT b.*, ba.* FROM battle b
       JOIN battleArmy ba ON ba.battle_id = b.id
       WHERE ba.army_id = $1`,
      [armyId]
    );
    return response.rows;
  }

  async delete(battleId: string): Promise<void> {
    const response = await this.db.query("DELETE FROM battle WHERE id = $1", [
      battleId,
    ]);
    return response.rows[0] || null;
  }

  async getReport(battleId: string): Promise<any> {
    console.log("Getting report for battle ID:", battleId);
    const response = await this.db.query(
      `SELECT 
            b.id AS battle_id,
            b.date,
            b.location,

            ba.role,
            ba.outcome,
            ba.casualties,
            s.name AS strategy_name,

            a.id AS army_id,
            a.name AS army_name,
            a.owner_id AS army_owner,

			u.user_id AS user_id,
    		u.username AS user_name,
    		u.email AS user_email

        FROM battle b
        JOIN battleArmy ba ON ba.battle_id = b.id
        JOIN army a ON a.id = ba.army_id
		JOIN users u ON u.user_id = a.owner_id
        LEFT JOIN strategy s ON s.id = ba.strategy_id
        WHERE b.id = $1;
        `,
      [battleId]
    );
    console.log(response.rows);
    return response.rows.length > 0 ? response.rows : null;
  }
}

// b.id AS battle_id,
// b.date,
// b.location,

// ba.role,
// ba.outcome,
// ba.casualties,

// a.id AS army_id,
// a.name AS army_name,
// a.owner_id AS army_owner
