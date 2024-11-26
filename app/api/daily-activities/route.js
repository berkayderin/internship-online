// app/api/daily-activities/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import dailyActivitySchema from '@/features/daily-activities/zod/DailyActivitySchema'

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
		const validationResult = dailyActivitySchema.safeParse(data)

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					errors: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const activity = await prisma.dailyActivity.create({
			data: {
				date: validationResult.data.date,
				content: validationResult.data.content,
				status: 'PENDING',
				userId: session.user.id
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
	} catch (error) {
		console.error('Error creating daily activity:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu', details: error.message },
			{ status: 500 }
		)
	}
}

export async function GET(req) {
	try {
		const session = await auth()
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { searchParams } = new URL(req.url)
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '10')
		const startDate = searchParams.get('startDate')
		const endDate = searchParams.get('endDate')
		const status = searchParams.get('status')
		const userId = searchParams.get('userId')

		const where = {
			...(session.user.role === 'USER'
				? { userId: session.user.id }
				: userId
				? { userId }
				: {}),
			...(startDate &&
				endDate && {
					date: {
						gte: new Date(startDate),
						lte: new Date(endDate)
					}
				}),
			...(status && status !== 'all'
				? {
						status: {
							equals: status.toUpperCase()
						}
				  }
				: {})
		}

		const [activities, total] = await Promise.all([
			prisma.dailyActivity.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				include: {
					user: {
						select: {
							firstName: true,
							lastName: true,
							department: true
						}
					}
				},
				orderBy: {
					date: 'desc'
				}
			}),
			prisma.dailyActivity.count({ where })
		])

		return NextResponse.json({
			data: activities,
			pagination: {
				page,
				limit,
				total,
				pageCount: Math.ceil(total / limit)
			}
		})
	} catch (error) {
		console.error('Error fetching daily activities:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
