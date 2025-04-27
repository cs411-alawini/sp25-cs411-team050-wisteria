import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "../../../lib/db";
import { signToken, verifyPassword } from "../../../lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

type UserRow = RowDataPacket & {
  UserId: number;
  PasswordField: string;
};

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as LoginBody;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 422 }
    );
  }

  // 1) fetch the user
  const [rows] = await pool.query<UserRow[]>(
    "SELECT UserId, PasswordField FROM userData WHERE EmailId = ?",
    [email]
  );
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }
  const user = rows[0];

  // 2) verify the password
  const isValid = await verifyPassword(password, user.PasswordField);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  // 3) sign JWT & set cookie
  const token = signToken({ userId: user.UserId });
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_MAX_AGE),
    path: "/",
  });
  return res;
}
