import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import internshipPeriodSchema from '@/features/internship-periods/zod/InternshipPeriodSchema'

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
		const data = await req.json()
		const validationResult = internshipPeriodSchema.safeParse(data)

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Doğrulama hatası',
					errors: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const period = await prisma.internshipPeriod.update({
			where: { id },
			data: validationResult.data
		})

		return NextResponse.json(period)
	} catch (error) {
		console.error('Error updating internship period:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu', details: error.message },
			{ status: 500 }
		)
	}
}

export async function DELETE(req, { params }) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Yetkisiz erişim' },
				{ status: 401 }
			)
		}

		const { id } = params

		// Önce bu dönemle ilişkili başvuruları kontrol et
		const applications = await prisma.application.findFirst({
			where: { periodId: id }
		})

		if (applications) {
			return NextResponse.json(
				{
					error: 'Bu dönem silinemez',
					details: 'Bu staj dönemine ait başvurular bulunmaktadır.'
				},
				{ status: 400 }
			)
		}

		await prisma.internshipPeriod.delete({
			where: { id }
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting internship period:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu', details: error.message },
			{ status: 500 }
		)
	}
}
