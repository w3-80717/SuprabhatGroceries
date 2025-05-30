// src/utils/hash.util.ts
import bcrypt from 'bcryptjs'; // npm install bcryptjs @types/bcryptjs

const SALT_ROUNDS = 10; // Store salt rounds in a config or env var for more flexibility

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};