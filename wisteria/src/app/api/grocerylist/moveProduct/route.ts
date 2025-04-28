import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../../lib/db"; 

export async function POST(req: NextRequest) {
  try {
    const { sourceListId, targetListId } = await req.json();

    if (!sourceListId || !targetListId) {
      return NextResponse.json(
        { error: "Missing sourceListId or targetListId." },
        { status: 400 }
      );
    }

    // Get userId from cookie
    const userIdCookie = req.cookies.get("userId")?.value;
    if (!userIdCookie) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const userId = Number(userIdCookie);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId." }, { status: 400 });
    }

    // Verify source list actually belongs to this user
    const [sourceRows] = await pool.query<any[]>(
      `SELECT 1 FROM groceryList WHERE GroceryListId = ? AND UserId = ? LIMIT 1`,
      [sourceListId, userId]
    );
    if (!sourceRows.length) {
      return NextResponse.json(
        { error: "Source list not found or not owned by user." },
        { status: 404 }
      );
    }

    // Call your stored procedure with the updated parameter list
    await pool.query(`CALL MoveProductsBetweenLists(?, ?, ?)`, [userId, sourceListId, targetListId]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}