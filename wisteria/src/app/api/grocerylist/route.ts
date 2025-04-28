import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const userIdCookie = req.cookies.get("userId")?.value;
    if (!userIdCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(userIdCookie);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId." }, { status: 400 });
    }

    const [groceryListRows] = await pool.query<any[]>(`
      CALL GetGroceryListWithEnvironmentalCostAndFuel(?)
    `, [userId]);

    return NextResponse.json({
      success: true,
      products: groceryListRows[0],  // <--- Remember CALL returns an array of arrays
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching grocery list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
