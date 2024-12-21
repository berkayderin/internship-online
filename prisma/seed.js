const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
	const holidays = [
		{
			type: 'NEW_YEAR',
			startDate: new Date('2024-01-01'),
			endDate: new Date('2024-01-01')
		},
		{
			type: 'RAMADAN',
			startDate: new Date('2024-04-10'),
			endDate: new Date('2024-04-12')
		},
		{
			type: 'NATIONAL_SOVEREIGNTY',
			startDate: new Date('2024-04-23'),
			endDate: new Date('2024-04-23')
		},
		{
			type: 'LABOR_DAY',
			startDate: new Date('2024-05-01'),
			endDate: new Date('2024-05-01')
		},
		{
			type: 'COMMEMORATION_YOUTH',
			startDate: new Date('2024-05-19'),
			endDate: new Date('2024-05-19')
		},
		{
			type: 'SACRIFICE',
			startDate: new Date('2024-06-16'),
			endDate: new Date('2024-06-19')
		},
		{
			type: 'DEMOCRACY',
			startDate: new Date('2024-07-15'),
			endDate: new Date('2024-07-15')
		},
		{
			type: 'VICTORY',
			startDate: new Date('2024-08-30'),
			endDate: new Date('2024-08-30')
		},
		{
			type: 'REPUBLIC',
			startDate: new Date('2024-10-29'),
			endDate: new Date('2024-10-29')
		}
	]

	for (const holiday of holidays) {
		await prisma.publicHoliday.create({
			data: holiday
		})
	}
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
