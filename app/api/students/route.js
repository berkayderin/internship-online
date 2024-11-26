// app/api/students/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const students = await prisma.user.findMany({
			where: {
				role: 'USER'
			},
			orderBy: {
				firstName: 'asc'
			}
		})

		return NextResponse.json(students)
	} catch (error) {
		console.error('Error fetching students:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
