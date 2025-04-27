import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import pool from "../../../../lib/db";

interface ProductRow {
  ProductName: string;
  CarbonFootprint_per_kg: number;
  LandUse_per_kg: number;
  WaterUse_per_kg: number;
  TotalEmissions: number;
  DistanceMiles: number;
  FuelUsageGallons: number;
}

type ProductRowPacket = ProductRow & RowDataPacket;

export async function POST(req: NextRequest) {
  try {
    const { keyword, city, country } = await req.json();

    if (!keyword || !country) {
      return NextResponse.json({ error: "Missing keyword or country" }, { status: 400 });
    }

    const [resultSets] = await pool.query<ProductRowPacket[][]>(
      `CALL SearchProductsWithDistance(?, ?, ?)`,
      [keyword, city || null, country]
    );

    const products = Array.isArray(resultSets) ? resultSets[0] : [];

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
