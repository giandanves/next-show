import {Ctx} from "blitz"
import {AuthenticationError} from "blitz"
import db from "db"
import {Login} from "../validations"
import {Password} from "src/lib/password"
import {Role} from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const {email, password} = Login.parse({email: rawEmail, password: rawPassword})
  const user = await db.user.findFirst({where: {email}})
  if (!user) {
    // Blitz default AuthenticationError message is confusing ("You must be logged in…")
    throw new AuthenticationError("Invalid email or password")
  }

  const result = await Password.verify(user.hashedPassword, password)
  if (result === Password.INVALID) {
    throw new AuthenticationError("Invalid email or password")
  }

  if (result === Password.VALID_NEEDS_REHASH) {
    const improvedHash = await Password.hash(password)
    await db.user.update({where: {id: user.id}, data: {hashedPassword: improvedHash}})
  }

  const {hashedPassword: _hashedPassword, ...rest} = user
  return rest
}

/** Same plain-handler style as signup — avoids resolver.pipe edge cases on auth. */
export default async function login(input: unknown, ctx: Ctx) {
  const data = Login.parse(input)
  const user = await authenticateUser(data.email, data.password)
  await ctx.session.$create({userId: user.id, role: user.role as Role})
  return user
}
