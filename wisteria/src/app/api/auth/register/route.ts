import { NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { hashPassword, signToken } from "../../../../../lib/auth";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  const { email, password, city, country } = await req.json();

  // (1) Simple server-side validation
  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 422 }
    );
  }

  // (2) Check if email exists
  const [[exists]] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM userData WHERE EmailId = ?",
    [email]
  );
  if (exists) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  // (3) Hash & insert
  const hashed = await hashPassword(password);
  const [result] = await pool.query(
    `INSERT INTO userData (EmailId, PasswordField, UserLocationId)
     VALUES (?, ?, ?)`,
    [email, hashed, /* you’d map city/country → locationId */ 1]
  );
  const userId = (result as any).insertId;

  // (4) Sign & set cookie
  const token = signToken({ userId });
  const res = NextResponse.json({ success: true, userId }, { status: 201 });
  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_MAX_AGE),
    path: "/",
  });
  return res;
}
