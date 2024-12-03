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
		const status = searchParams.get('status')
		const search = searchParams.get('search')

		// Filtreleme koşullarını oluştur
		const where = {
			...(status && status !== 'all' && { status }),
			...(search && {
				content: {
					contains: search,
					mode: 'insensitive'
				}
			}),
			// Admin olmayan kullanıcılar için sadece kendi aktivitelerini göster
			...(session.user.role !== 'ADMIN' && {
				userId: session.user.id
			})
		}

		// Toplam kayıt sayısını al
		const total = await prisma.dailyActivity.count({ where })

		// Aktiviteleri getir
		const activities = await prisma.dailyActivity.findMany({
			where,
			include: {
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						department: true
					}
				}
			},
			orderBy: {
				date: 'desc'
			},
			skip: (page - 1) * limit,
			take: limit
		})

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
		console.error('Error fetching activities:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
