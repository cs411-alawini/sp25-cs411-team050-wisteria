// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;

  // 2) pull user + location in one query
  const [rows] = await pool.query<
    {
      FirstName: string;
      LastName: string;
      EmailId: string;
      City: string;
      Country: string;
    }[]
  >(
    `SELECT u.FirstName, u.LastName, u.EmailId, l.City, l.Country
     FROM userData u
     JOIN locationData l ON u.UserLocationId = l.LocationId
     WHERE u.UserId = ?`,
    [userId]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { FirstName, LastName, EmailId, City, Country } = rows[0];
  return NextResponse.json({
    firstName: FirstName,
    lastName: LastName,
    email: EmailId,
    city: City,
    country: Country,
  });
}
