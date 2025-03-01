import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const logger = new Logger('PrismaSeed')

async function main() {
	// Roles
	const roles = [
		{
			name: 'admin',
			description: 'Administrator for the whole application',
		},
		{
			name: 'sales',
			description: 'Sales person',
		},
		{
			name: 'cashier',
			description: 'Cashier',
		},
	]

	await prisma.role.createMany({ data: roles })

	// Users
	const users = [
		{
			name: 'Admin',
			username: 'admin',
			password: '$2a$12$B561EYV/fsRwBC9nKaiVGuDglwwhUrpI6jvZxbeBaTQGm.4dlBvFO', // Password: passpass
			phoneNumber: '+251912345678',
			roleId: 1,
			createdBy: 1,
		},
	]
	await prisma.user.createMany({ data: users })

	// I use this to make the ID sequence start from the last seeded data ID
	const sequenceInitializer: Record<string, number> = {
		users: users.length,
	}

	Object.entries(sequenceInitializer).forEach(([key, value]) => {
		prisma.$queryRawUnsafe(`
      ALTER SEQUENCE "public"."${key}_id_seq" RESTART WITH ${value};
    `)
	})
}

main()
	.catch(async (e) => {
		logger.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
