import bcrypt from "bcryptjs"

/**
 * Pure-JS password hashing for Vercel serverless.
 * Blitz's SecurePassword depends on sodium-native, which crashes on Vercel (empty 500s).
 */
export const Password = {
  VALID: "VALID" as const,
  VALID_NEEDS_REHASH: "VALID_NEEDS_REHASH" as const,
  INVALID: "INVALID" as const,

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  },

  async verify(
    hashedPassword: string | null | undefined,
    password: string,
  ): Promise<"VALID" | "VALID_NEEDS_REHASH" | "INVALID"> {
    if (!hashedPassword) return Password.INVALID
    const ok = await bcrypt.compare(password, hashedPassword)
    return ok ? Password.VALID : Password.INVALID
  },
}
