import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyToken } from "../../../../lib/auth";
import pool from "../../../../lib/db";

type Profile = RowDataPacket & {
  UserId: number;
  FirstName: string;
  LastName: string;
  EmailId: string;
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token && verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await pool.query<Profile[]>(
    "SELECT UserId, FirstName, LastName, EmailId FROM userData WHERE UserId = ?",
    [payload.userId]
  );
  return NextResponse.json(rows[0]);
}
