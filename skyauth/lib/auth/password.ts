import bcrypt from "bcryptjs";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain: string, hashed: string) {
  if (!hashed) return false;
  return bcrypt.compare(plain, hashed);
}
