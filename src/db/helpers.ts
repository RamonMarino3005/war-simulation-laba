import { DB_Controller } from "./types/dbTypes.js";

export function testConnection(db: DB_Controller) {
  db.query("SELECT NOW()")
    .then((res) => {
      console.log("Database connection test successful:", res.rows);
    })
    .catch((err) => {
      console.error("Database connection test failed:", err);
    });
}
