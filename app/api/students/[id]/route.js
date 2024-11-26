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

		const activities = await prisma.dailyActivity.findMany({
			where: {
				userId: id
			},
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
		})

		return NextResponse.json({
			data: activities,
			pagination: {
				total: activities.length
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
