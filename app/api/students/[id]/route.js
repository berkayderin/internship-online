// app/api/students/[id]/route.js
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

		const student = await prisma.user.findUnique({
			where: {
				id,
				role: 'USER'
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				department: true
			}
		})

		if (!student) {
			return NextResponse.json(
				{ error: 'Öğrenci bulunamadı' },
				{ status: 404 }
			)
		}

		return NextResponse.json(student)
	} catch (error) {
		console.error('Error fetching student:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}

export async function DELETE(req, { params }) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params

		// Önce öğrencinin aktivitelerini sil
		await prisma.dailyActivity.deleteMany({
			where: { userId: id }
		})

		// Sonra öğrenciyi sil
		await prisma.user.delete({
			where: { id }
		})

		return NextResponse.json({ message: 'Öğrenci başarıyla silindi' })
	} catch (error) {
		console.error('Error deleting student:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
