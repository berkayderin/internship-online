// app/api/applications/route.js
import { NextResponse } from 'next/server'
import applicationSchema from '@/features/applications/zod/ApplicationSchema'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET() {
	try {
		const session = await auth()

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const applications = await prisma.application.findMany({
			where:
				session.user.role === 'ADMIN'
					? {}
					: { userId: session.user.id },
			include: {
				period: true,
				user: {
					select: {
						firstName: true,
						lastName: true,
						department: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return NextResponse.json(applications)
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}

export async function POST(req) {
	try {
		const session = await auth()

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const data = await req.json()

		const existingApplication = await prisma.application.findFirst({
			where: {
				userId: session.user.id,
				periodId: data.periodId
			}
		})

		if (existingApplication) {
			return NextResponse.json(
				{ error: 'Bu dönem için zaten başvuru yaptınız.' },
				{ status: 400 }
			)
		}

		const validationResult = applicationSchema.safeParse(data)

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					errors: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const application = await prisma.application.create({
			data: {
				...validationResult.data,
				userId: session.user.id,
				status: 'PENDING'
			}
		})

		return NextResponse.json(application)
	} catch (error) {
		console.error('Detailed error:', {
			message: error.message,
			stack: error.stack,
			cause: error.cause
		})

		return NextResponse.json(
			{ error: 'Bir hata oluştu', details: error.message },
			{ status: 500 }
		)
	}
}
