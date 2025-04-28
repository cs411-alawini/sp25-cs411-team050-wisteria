import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing productId or quantity." }, { status: 400 });
    }

    const userIdCookie = req.cookies.get("userId")?.value;
    if (!userIdCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(userIdCookie);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId." }, { status: 400 });
    }

    try {
      await pool.query(`
        INSERT INTO groceryProduct (UserId, ProductId, Quantity)
        VALUES (?, ?, ?)
      `, [userId, productId, quantity]);
    } catch (insertError: any) {
      if (insertError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: "Product already exists in your list." }, { status: 409 });
      } else {
        console.error("Unexpected insert error:", insertError);
        throw insertError;
      }
    }

    // Fetch updated grocery list
    const [groceryListRows] = await pool.query<any[]>(`
      CALL GetGroceryListWithEnvironmentalCostAndFuel(?)
    `, [userId]);

    return NextResponse.json({
      success: true,
      products: groceryListRows[0],  // Get the first result array
    }, { status: 200 });

  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
