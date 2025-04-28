import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "../../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { product, city, country, quantity } = await req.json();

    if (!product || !country || !quantity) {
      return NextResponse.json({ error: "Missing product, country, or quantity." }, { status: 400 });
    }

    let cityParam: string | null = null;
    if (city && city.trim() !== "") {
      cityParam = city.trim();
    }

    // 1) Search for a matching product (case-insensitive)
    const [productRows] = await pool.query<any[]>(`
      SELECT ProductId, ProductName
      FROM productData
      WHERE LOWER(ProductName) LIKE LOWER(CONCAT('%', ?, '%'))
    `, [product]);

    // 2) If no match at all, allow adding manually (skip ProductId lookup, but you will need to adjust your DB later)
    if (productRows.length === 0) {
      return NextResponse.json({ error: "No matching product found. Please check product spelling or add manually later." }, { status: 404 });
    }

    const matchedProduct = productRows[0];  // Pick the first match for now (you can later add dropdown logic)

    // 3) Insert into groceryProduct
    await pool.query(`
      INSERT INTO groceryProduct (UserId, ProductId, Quantity)
      VALUES (
        (SELECT UserId FROM userData WHERE EmailId = (SELECT EmailId FROM userData WHERE UserId = ?)),
        ?, ?
      )
    `, [req.cookies.get("userId")?.value, matchedProduct.ProductId, quantity]);

    return NextResponse.json({
      success: true,
      product: {
        ProductName: matchedProduct.ProductName,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
