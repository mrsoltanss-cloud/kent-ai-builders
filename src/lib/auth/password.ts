import bcrypt from "bcryptjs";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}
export async function verifyPassword(hash: string, plain: string) {
  return bcrypt.compare(plain, hash);
}
