// app/api/daily-activities/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth' // Değişiklik burada
import prisma from '@/lib/prisma'
import dailyActivitySchema from '@/zod/DailyActivitySchema'

export async function POST(req) {
	try {
		// getServerSession yerine auth() kullanıyoruz
		const session = await auth()

		// Session kontrolü
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

		// Aktiviteyi oluştur
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

		// Filtreleme koşulları düzeltildi
		const where = {
			...(session.user.role === 'USER'
				? { userId: session.user.id }
				: {}),
			...(startDate &&
				endDate && {
					date: {
						gte: new Date(startDate),
						lte: new Date(endDate)
					}
				}),
			// Status filtrelemesi düzeltildi
			...(status && status !== 'all'
				? {
						status: {
							equals: status.toUpperCase() // Status değerini büyük harfe çevir
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
