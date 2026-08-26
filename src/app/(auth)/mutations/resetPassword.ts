import {hash256} from "@blitzjs/auth"
import {resolver} from "@blitzjs/rpc"
import db from "db"
import {Password} from "src/lib/password"
import {ResetPassword} from "../validations"
import login from "./login"

export class ResetPasswordError extends Error {
  name = "ResetPasswordError"
  message = "Reset password link is invalid or it has expired."
}

export default resolver.pipe(resolver.zod(ResetPassword), async ({password, token}, ctx) => {
  if (!token) throw new ResetPasswordError("Token is required")
  const hashedToken = hash256(token)
  const possibleToken = await db.token.findFirst({
    where: {hashedToken, type: "RESET_PASSWORD"},
    include: {user: true},
  })

  if (!possibleToken) {
    throw new ResetPasswordError()
  }
  const savedToken = possibleToken

  await db.token.delete({where: {id: savedToken.id}})

  if (savedToken.expiresAt < new Date()) {
    throw new ResetPasswordError()
  }

  const hashedPassword = await Password.hash(password.trim())
  const user = await db.user.update({
    where: {id: savedToken.userId},
    data: {hashedPassword},
  })

  await db.session.deleteMany({where: {userId: user.id}})

  await login({email: user.email, password}, ctx)

  return true
})
