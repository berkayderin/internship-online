import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function PATCH(req, { params }) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params
		const { status, feedback } = await req.json()

		const application = await prisma.application.update({
			where: { id },
			data: {
				status,
				feedback
			},
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						department: true
					}
				},
				period: true
			}
		})

		return NextResponse.json(application)
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
