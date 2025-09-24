import PostgresDb from "./postgres/index.js";
import { DB_Controller } from "./types/dbTypes.js";

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error(
    "Database configuration environment variables are missing: DB_USER or DB_PASSWORD"
  );
}

const db_config = {
  user: process.env.DB_USER!.toLowerCase(),
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: (process.env.DB_NAME || "warsimapp").toLowerCase(),
};

export const db: DB_Controller = new PostgresDb(db_config);
