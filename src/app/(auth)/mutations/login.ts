import {resolver} from "@blitzjs/rpc"
import {AuthenticationError} from "blitz"
import db from "db"
import {Login} from "../validations"
import {Password} from "src/lib/password"
import {Role} from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const {email, password} = Login.parse({email: rawEmail, password: rawPassword})
  const user = await db.user.findFirst({where: {email}})
  if (!user) throw new AuthenticationError()

  const result = await Password.verify(user.hashedPassword, password)
  if (result === Password.INVALID) throw new AuthenticationError()

  if (result === Password.VALID_NEEDS_REHASH) {
    const improvedHash = await Password.hash(password)
    await db.user.update({where: {id: user.id}, data: {hashedPassword: improvedHash}})
  }

  const {hashedPassword: _hashedPassword, ...rest} = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({email, password}, ctx) => {
  const user = await authenticateUser(email, password)
  await ctx.session.$create({userId: user.id, role: user.role as Role})
  return user
})
