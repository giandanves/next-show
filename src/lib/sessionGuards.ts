import {AuthorizationError, Ctx} from "blitz"
import type {Role} from "types"
import {isPlatformCreatorOrAdmin} from "./artistAccess"

export function requireAuthenticated(ctx: Ctx): {userId: number; role: Role} {
  if (!ctx.session.userId) throw new AuthorizationError()
  return {userId: ctx.session.userId, role: ctx.session.role as Role}
}

export function requireCreatorOrAdmin(ctx: Ctx): {userId: number; role: Role} {
  const session = requireAuthenticated(ctx)
  if (!isPlatformCreatorOrAdmin(session.role)) throw new AuthorizationError()
  return session
}
