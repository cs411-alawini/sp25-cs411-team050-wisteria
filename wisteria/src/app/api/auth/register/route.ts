import { NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { hashPassword } from "../../../../../lib/auth";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  const { FirstName, LastName, EmailId, PasswordField, UserLocationId } =
    await req.json();

  // 1) check email not taken
  const [[exists]] = await pool.query<RowDataPacket[][]>(
    "SELECT 1 FROM userData WHERE EmailId = ?",
    [EmailId]
  );
  if (exists) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  // 2) hash password
  const hashed = await hashPassword(PasswordField);

  // 3) insert
  const [res] = await pool.query(
    "INSERT INTO userData (FirstName, LastName, EmailId, PasswordField, UserLocationId) VALUES (?, ?, ?, ?, ?)",
    [FirstName, LastName, EmailId, hashed, UserLocationId]
  );

  return NextResponse.json({ success: true, userId: (res as any).insertId });
}
