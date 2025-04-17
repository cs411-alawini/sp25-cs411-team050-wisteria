import { Pool } from "pg";

let pool: Pool | null = null;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({
      host:
        process.env.NODE_ENV === "production"
          ? "/cloudsql/YOUR_PROJECT:REGION:INSTANCE_NAME"
          : "localhost",
      port: process.env.NODE_ENV === "production" ? undefined : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 20,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
};
