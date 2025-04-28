import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse & validate body ───────────────────────────────
    const { productId, quantity, locationId, glId } = await req.json();

    if (!productId || !quantity || !locationId || !glId) {
      return NextResponse.json(
        { error: "Missing productId, quantity, locationId or glId." },
        { status: 400 }
      );
    }

    // ── 2. Validate user from cookie ───────────────────────────
    const userIdCookie = req.cookies.get("userId")?.value;
    if (!userIdCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(userIdCookie);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId." }, { status: 400 });
    }

    // ── 3. Insert or reject duplicate ──────────────────────────
    try {
      await pool.query(
        `
        INSERT INTO groceryProduct
          (glId, UserId, ProductId, Quantity, LocationId)
        VALUES (?, ?, ?, ?, ?);
        `,
        [glId, userId, productId, quantity, locationId]
      );
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          { error: "Product already exists in this grocery list." },
          { status: 409 }
        );
      }
      console.error("Insert error:", err);
      throw err;
    }

    // ── 4. Return the fresh grocery-list snapshot ──────────────
    const [resultSets] = await pool.query<any[]>(
      `CALL GetGroceryListWithEnvironmentalCostAndFuel(?, ?)`,
      [userId, glId]
    );

    return NextResponse.json(
      { success: true, products: resultSets[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/grocerylist/add:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
