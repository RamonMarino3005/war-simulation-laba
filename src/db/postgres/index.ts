// db/index.js
import pg, { Pool, QueryConfig, QueryResult, Client } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getDirname } from "../../utils/fs/dirname.js";
import { DB_Controller } from "db/types/dbTypes.js";

dotenv.config();

type PGConfig = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
};
export default class PostgresDb implements DB_Controller {
  private pool: Pool | null;

  constructor(private db_config: PGConfig) {}

  private async createPool() {
    if (!this.pool) {
      this.pool = new Pool(this.db_config);
      console.log("Postgres connection pool created");
    }
  }

  async query<T = any>(
    sql: string | QueryConfig<any[]>,
    params?: any[]
  ): Promise<QueryResult<T>> {
    if (!this.pool) throw new Error("Database not initialized");

    return this.pool.query<T>(sql, params);
  }

  async close() {
    if (this.pool) await this.pool.end();
  }

  async init() {
    try {
      // Ensure database exists before creating pool
      await this.ensureDatabase(this.db_config.database);

      // Create the pool
      await this.createPool();

      // Initialize tables
      await this.initTables();

      console.log("Database connected successfully");
    } catch (err) {
      console.error("Failed to connect to database:", err);
      throw err;
    }
  }

  private async initTables() {
    const __dirname = getDirname(import.meta.url);
    const sql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf-8");
    await this.query(sql);
    console.log("Database tables initialized");
  }

  private async ensureDatabase(dbName: string) {
    // Connect to default 'postgres' DB
    const client = new Client({
      user: this.db_config.user,
      password: this.db_config.password,
      host: this.db_config.host,
      port: this.db_config.port,
      database: "postgres",
    });

    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" not found. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
    } else {
      console.log(`Database "${dbName}" exists.`);
    }

    await client.end();
  }
}
