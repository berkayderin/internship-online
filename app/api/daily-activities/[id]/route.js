// app/api/daily-activities/[id]/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth' // Değişiklik burada
import prisma from '@/lib/prisma'
import activityFeedbackSchema from '@/features/daily-activities/zod/ActivityFeedbackSchema'
import dailyActivitySchema from '@/features/daily-activities/zod/DailyActivitySchema'

export async function PATCH(req, { params }) {
	try {
		const session = await auth()
		if (!session) {
			return NextResponse.json(
				{ error: 'Giriş yapmanız gerekiyor' },
				{ status: 401 }
			)
		}

		const { id } = params
		const data = await req.json()

		if (session.user.role === 'ADMIN') {
			const validationResult = activityFeedbackSchema.safeParse(data)
			if (!validationResult.success) {
				return NextResponse.json(
					{
						error: 'Validation failed',
						errors: validationResult.error.errors
					},
					{ status: 400 }
				)
			}

			const activity = await prisma.dailyActivity.update({
				where: { id },
				data: {
					status: validationResult.data.status,
					feedback: validationResult.data.feedback,
					adminId: session.user.id
				},
				include: {
					user: {
						select: {
							firstName: true,
							lastName: true,
							department: true
						}
					}
				}
			})

			return NextResponse.json(activity)
		}

		const activity = await prisma.dailyActivity.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						department: true
					}
				}
			}
		})

		if (!activity || activity.userId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Bu aktiviteyi güncelleme yetkiniz yok' },
				{ status: 403 }
			)
		}

		if (activity.status !== 'PENDING') {
			return NextResponse.json(
				{
					error: 'Onaylanmış veya reddedilmiş aktivite güncellenemez'
				},
				{ status: 400 }
			)
		}

		const validationResult = dailyActivitySchema.safeParse({
			...data,
			date: new Date(data.date)
		})

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					errors: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const updatedActivity = await prisma.dailyActivity.update({
			where: { id },
			data: validationResult.data,
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						department: true
					}
				}
			}
		})

		return NextResponse.json(updatedActivity)
	} catch (error) {
		console.error('Error updating daily activity:', error)
		return NextResponse.json(
			{
				error: 'Bir hata oluştu',
				details: error.message
			},
			{ status: 500 }
		)
	}
}
