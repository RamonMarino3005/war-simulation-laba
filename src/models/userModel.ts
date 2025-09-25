import {
  PublicUser,
  StoredUser,
  UserFields,
} from "types/entities/userTypes.js";
import { randomUUID } from "crypto";
import { DB_Controller } from "../types/db/db_types.js";
import { IUserModel } from "types/models/IUserModel.js";

export class UserModel implements IUserModel {
  constructor(private db: DB_Controller) {}

  async getUsers(): Promise<PublicUser[]> {
    const { rows } = await this.db.query("SELECT * FROM users");

    const users: PublicUser[] = rows.map((row) => ({
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      role: row.role,
    }));
    return users;
  }

  async createUser(user: UserFields): Promise<PublicUser> {
    const id = randomUUID();

    const { rows } = await this.db.query(
      "INSERT INTO users (user_id, username, email, role, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, user.username, user.email, user.role, user.password]
    );

    const publicUser: PublicUser = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      email: rows[0].email,
      role: rows[0].role,
    };

    return publicUser;
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    const { rows } = await this.db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return rows.length ? rows[0] : null;
  }

  async findByUsername(username: string): Promise<StoredUser | null> {
    const { rows } = await this.db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows.length ? rows[0] : null;
  }

  async findById(userId: string): Promise<StoredUser | null> {
    const { rows } = await this.db.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    return rows.length ? rows[0] : null;
  }

  async deleteUser(userId: string) {
    await this.db.query("DELETE FROM users WHERE user_id = $1", [userId]);
    return true;
  }
}
