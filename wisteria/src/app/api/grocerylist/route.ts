import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value; // Assuming you store userId in cookies
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Query the database using the stored procedure to get the grocery list
    const [rows] = await pool.query(
      `CALL GetGroceryListWithEnvironmentalCostAndFuel(?)`,
      [userId]
    );

    // If no rows returned, send an error message
    if (rows.length === 0) {
      return NextResponse.json({ error: "No grocery list found" }, { status: 404 });
    }

    // Return the data
    return NextResponse.json({ groceryList: rows }, { status: 200 });

  } catch (error) {
    console.error("Error fetching grocery list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
