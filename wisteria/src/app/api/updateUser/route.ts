import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../../lib/db";
import { OkPacket, RowDataPacket } from "mysql2";

interface UserUpdateRequest {
  oldEmail: string;
  firstName: string;
  lastName: string;
  newEmail: string;
  newPassword?: string;
  city?: string;
  country?: string;
}

interface LocationData extends RowDataPacket {
  LocationId: number;
}

interface UserData extends RowDataPacket {
  EmailId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // Validate request body structure
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const {
    oldEmail,
    firstName,
    lastName,
    newEmail,
    newPassword,
    city,
    country,
  } = req.body as UserUpdateRequest;

  // Enhanced validation
  if (!oldEmail || !firstName || !lastName || !newEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (typeof oldEmail !== "string" || typeof newEmail !== "string") {
    return res.status(400).json({ error: "Email must be a string" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if the new email is already taken by another user
    if (oldEmail !== newEmail) {
      const [emailCheck] = await connection.query<UserData[]>(
        "SELECT EmailId FROM userData WHERE EmailId = ?",
        [newEmail]
      );

      if (emailCheck.length > 0) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }

    await connection.beginTransaction();

    // Handle location update
    let locationId: number | null = null;
    if (city && country) {
      const [location] = await connection.query<LocationData[]>(
        "SELECT LocationId FROM locationData WHERE City = ? AND Country = ?",
        [city, country]
      );

      if (location.length > 0) {
        locationId = location[0].LocationId;
      } else {
        const [insertResult] = await connection.query<OkPacket>(
          "INSERT INTO locationData (City, Country) VALUES (?, ?)",
          [city, country]
        );
        locationId = insertResult.insertId;
      }
    }

    // Build dynamic query
    const updateFields: string[] = [
      "FirstName = ?",
      "LastName = ?",
      "EmailId = ?",
    ];

    const values: (string | number)[] = [firstName, lastName, newEmail];

    if (newPassword) {
      updateFields.push("PasswordField = ?");
      values.push(newPassword);
    }

    if (locationId !== null) {
      updateFields.push("UserLocationId = ?");
      values.push(locationId);
    }

    values.push(oldEmail);

    const query = `
      UPDATE userData
      SET ${updateFields.join(", ")}
      WHERE EmailId = ?;
    `;

    const [result] = await connection.query<OkPacket>(query, values);
    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("Error updating user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Failed to update user",
      details: errorMessage,
    });
  } finally {
    if (connection) connection.release();
  }
}
