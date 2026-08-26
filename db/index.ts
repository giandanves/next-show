import {enhancePrisma} from "blitz"
import {PrismaClient} from "@prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof EnhancedPrisma>
}

export * from "@prisma/client"

const db = globalForPrisma.prisma ?? new EnhancedPrisma()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

export default db
