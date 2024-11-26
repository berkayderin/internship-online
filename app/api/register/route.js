// app/api/register/route.js
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request) {
	try {
		const body = await request.json()
		const { email, password, fullname } = body

		// Email kontrolü
		const existingUser = await prisma.user.findUnique({
			where: { email }
		})

		if (existingUser) {
			return NextResponse.json(
				{ message: 'Bu email adresi zaten kullanılıyor' },
				{ status: 400 }
			)
		}

		// Şifre hashleme
		const hashedPassword = await bcrypt.hash(password, 10)

		// Kullanıcı oluşturma
		const user = await prisma.user.create({
			data: {
				email,
				passwordHash: hashedPassword,
				fullname,
				role: 'user'
			}
		})

		const { passwordHash: _, ...userWithoutPassword } = user

		return NextResponse.json(userWithoutPassword)
	} catch (error) {
		return NextResponse.json(
			{ message: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
