import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export function signToken(payload: { userId: number }) {
  if (!SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  // MAKE EXPIRES IN THE CORRECT TYPE
  return jwt.sign(payload, SECRET, {
    expiresIn: EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}

export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as {
      userId: number;
      iat: number;
      exp: number;
    };
  } catch {
    return null;
  }
}
