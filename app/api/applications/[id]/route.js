import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function PATCH(req, { params }) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Yetkisiz erişim' },
				{ status: 401 }
			)
		}

		const { id } = params
		const { status, feedback } = await req.json()

		const application = await prisma.application.findUnique({
			where: { id },
			select: { userId: true }
		})

		if (application.userId === session.user.id) {
			return NextResponse.json(
				{ error: 'Kendi başvurunuzu onaylayamazsınız' },
				{ status: 403 }
			)
		}

		const updatedApplication = await prisma.application.update({
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

		return NextResponse.json(updatedApplication)
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
