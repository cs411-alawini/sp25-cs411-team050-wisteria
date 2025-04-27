import type { NextApiRequest, NextApiResponse } from "next";

import { RowDataPacket } from "mysql2";
import pool from "../../../lib/db";

// tell TS that each row is a RowDataPacket plus our field
type Data = RowDataPacket & {
  current_time: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>
) {
  try {
    // now use Data[] as the generic, which extends RowDataPacket
    const [rows] = await pool.query<Data[]>("SELECT NOW() AS current_time");

    res.status(200).json(rows);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed." });
  }
}
