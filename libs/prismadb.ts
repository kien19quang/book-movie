import { PrismaClient } from '@prisma/client'

const prismadbClient = global.prismadb || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prismadb = prismadbClient

export default prismadbClient
