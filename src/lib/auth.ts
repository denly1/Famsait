import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "family-moscow-super-secret-key-2026-change-me"
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "FamAdmin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "!MscFam909";

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "FamAdmin",
    password: process.env.ADMIN_PASSWORD || "!MscFam909",
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}