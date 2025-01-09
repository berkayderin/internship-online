// app/api/students/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const page = parseInt(req.nextUrl.searchParams.get('page')) || 1
		const limit =
			parseInt(req.nextUrl.searchParams.get('limit')) || 10
		const department = req.nextUrl.searchParams.get('department')
		const search = req.nextUrl.searchParams.get('search')
		const skip = (page - 1) * limit

		const where = {
			role: 'USER',
			...(department && { department }),
			...(search && {
				OR: [
					{ firstName: { contains: search, mode: 'insensitive' } },
					{ lastName: { contains: search, mode: 'insensitive' } }
				]
			})
		}

		const [students, total] = await Promise.all([
			prisma.user.findMany({
				where,
				orderBy: {
					createdAt: 'desc'
				},
				skip,
				take: limit
			}),
			prisma.user.count({
				where
			})
		])

		return NextResponse.json({
			students,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		})
	} catch (error) {
		console.error('Error fetching students:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
