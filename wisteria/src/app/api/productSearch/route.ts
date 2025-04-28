import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import pool from "../../../../lib/db";

interface ProductRow {
  ProductId: number;   // <--- ADD ProductId here
  ProductName: string;
  CarbonFootprint_per_kg: number;
  LandUse_per_kg: number;
  WaterUse_per_kg: number;
  TotalEmissions: number;
  DistanceMiles: number;
  FuelUsageGallons: number;
  Latitude: number;
  Longitude: number;
}

type ProductRowPacket = ProductRow & RowDataPacket;

interface LocationRow {
  Latitude: number;
  Longitude: number;
}

type LocationRowPacket = LocationRow & RowDataPacket;

export async function POST(req: NextRequest) {
  try {
    const { keyword, city, country } = await req.json();

    if (!keyword || !country) {
      return NextResponse.json({ error: "Missing keyword or country" }, { status: 400 });
    }

    const userIdCookie = req.cookies.get("userId")?.value;
    if (!userIdCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(userIdCookie);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // 1) Search products
    const [resultSets] = await pool.query<ProductRowPacket[][]>(
      `CALL SearchProductsWithDistance(?, ?, ?)`,
      [keyword, city || null, country]
    );

    const productsRaw = Array.isArray(resultSets) ? resultSets[0] : [];

    const products = productsRaw.map((product) => ({
      ProductId: product.ProductId,      // <-- explicitly extract
      ProductName: product.ProductName,
      CarbonFootprint_per_kg: product.CarbonFootprint_per_kg,
      LandUse_per_kg: product.LandUse_per_kg,
      WaterUse_per_kg: product.WaterUse_per_kg,
      TotalEmissions: product.TotalEmissions,
      DistanceMiles: product.DistanceMiles,
      FuelUsageGallons: product.FuelUsageGallons,
      Location: {
        latitude: product.Latitude,
        longitude: product.Longitude,
      },
    }));

    // 2) Fetch user's location
    const [userLocationRows] = await pool.query<LocationRowPacket[]>(
      `SELECT l.Latitude, l.Longitude
       FROM userData u
       JOIN locationData l ON u.UserLocationId = l.LocationId
       WHERE u.UserId = ?`,
      [userId]
    );

    if (userLocationRows.length === 0) {
      return NextResponse.json({ error: "User location not found" }, { status: 404 });
    }

    const { Latitude, Longitude } = userLocationRows[0];

    // 3) Return both products and user location
    return NextResponse.json({
      products,
      userLocation: { latitude: Latitude, longitude: Longitude }
    }, { status: 200 });

  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
