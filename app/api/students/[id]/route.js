// app/api/students/[id]/activities/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

import prisma from '@/lib/prisma'

export async function GET(req, { params }) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params
		const { searchParams } = new URL(req.url)
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '10')
		const status = searchParams.get('status')
		const search = searchParams.get('search')
		const startDate = searchParams.get('startDate')
		const endDate = searchParams.get('endDate')

		const where = {
			userId: id,
			...(status && status !== 'all'
				? {
						status: {
							equals: status.toUpperCase()
						}
				  }
				: {}),
			...(search
				? {
						OR: [
							{
								content: {
									contains: search,
									mode: 'insensitive'
								}
							}
						]
				  }
				: {}),
			...(startDate &&
				endDate && {
					date: {
						gte: new Date(startDate),
						lte: new Date(endDate)
					}
				})
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
		console.error('Error fetching student activities:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
