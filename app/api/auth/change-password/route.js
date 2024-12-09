import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { changePasswordSchema } from '@/features/auth/zod/ChangePasswordSchema'

export async function POST(req) {
	try {
		const session = await auth()

		if (!session) {
			return NextResponse.json(
				{ error: 'Giriş yapmanız gerekiyor' },
				{ status: 401 }
			)
		}

		const data = await req.json()
		const validationResult = changePasswordSchema.safeParse(data)

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: 'Doğrulama hatası',
					errors: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const { currentPassword, newPassword } = validationResult.data

		// Kullanıcıyı bul
		const user = await prisma.user.findUnique({
			where: { id: session.user.id }
		})

		// Mevcut şifreyi kontrol et
		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			user.passwordHash
		)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: 'Mevcut şifre yanlış' },
				{ status: 400 }
			)
		}

		// Yeni şifreyi hashle
		const hashedPassword = await bcrypt.hash(newPassword, 10)

		// Şifreyi güncelle
		await prisma.user.update({
			where: { id: session.user.id },
			data: { passwordHash: hashedPassword }
		})

		return NextResponse.json({
			message: 'Şifreniz başarıyla güncellendi'
		})
	} catch (error) {
		console.error('Şifre değiştirme hatası:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
