import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const [rows] = await pool.query(
      `CALL GetGroceryListWithEnvironmentalCostAndFuel(?)`,
      [userId]
    );

    if (!rows || rows[0].length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });  // no products yet is fine
    }

    return NextResponse.json({ products: rows[0] }, { status: 200 }); // <-- rows[0] here!
  } catch (error) {
    console.error("Error fetching grocery list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
