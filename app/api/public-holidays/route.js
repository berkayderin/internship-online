import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import publicHolidaySchema from '@/features/public-holidays/zod/PublicHolidaySchema'

export async function GET() {
	try {
		const session = await auth()
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const holidays = await prisma.publicHoliday.findMany({
			orderBy: { startDate: 'asc' }
		})

		return NextResponse.json(holidays)
	} catch (error) {
		console.error('Error fetching public holidays:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}

export async function POST(req) {
	try {
		const session = await auth()
		if (session?.user?.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const data = await req.json()
		const validationResult = publicHolidaySchema.safeParse(data)

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					errors: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const holiday = await prisma.publicHoliday.create({
			data: validationResult.data
		})

		return NextResponse.json(holiday)
	} catch (error) {
		console.error('Error creating public holiday:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
