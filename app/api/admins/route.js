import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { hash } from 'bcryptjs'
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

		const searchParams = req.nextUrl.searchParams
		const search = searchParams.get('search')?.toLowerCase() || ''

		const admins = await prisma.user.findMany({
			where: {
				role: 'ADMIN',
				OR: [
					{
						firstName: {
							contains: search,
							mode: 'insensitive'
						}
					},
					{
						lastName: {
							contains: search,
							mode: 'insensitive'
						}
					}
				]
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				department: true,
				createdAt: true,
				updatedAt: true
			}
		})

		return NextResponse.json(admins)
	} catch (error) {
		console.error('Error fetching admins:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}

export async function POST(req) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await req.json()

		// E-posta kontrolü
		const existingUser = await prisma.user.findUnique({
			where: {
				email: body.email?.trim()
			}
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Bu e-posta adresi zaten kullanımda' },
				{ status: 400 }
			)
		}

		// Şifre hash'leme
		const hashedPassword = await hash(body.password, 10)

		const admin = await prisma.user.create({
			data: {
				email: body.email?.trim(),
				firstName: body.firstName?.trim(),
				lastName: body.lastName?.trim(),
				department: body.department,
				passwordHash: hashedPassword,
				role: 'ADMIN'
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				department: true,
				createdAt: true,
				updatedAt: true
			}
		})

		return NextResponse.json(admin)
	} catch (error) {
		console.error('Error creating admin:', error)
		return NextResponse.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}
