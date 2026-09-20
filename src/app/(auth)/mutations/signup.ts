import {Ctx} from "blitz"
import db from "db"
import {Password} from "src/lib/password"
import type {Role} from "types"
import {Signup} from "../validations"

export default async function signup(input: unknown, ctx: Ctx) {
  const data = Signup.parse(input)
  const role: Role = data.isProducer ? "CREATOR" : "USER"
  const hashedPassword = await Password.hash(data.password)

  const user = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      hashedPassword,
      role,
    },
  })

  await ctx.session.$create({
    userId: user.id,
    role,
  })

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  }
}
