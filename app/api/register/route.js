// app/api/register/route.js
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, department } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Bu email adresi zaten kullanılıyor' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        department,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Kayıt işlemi sırasında bir hata oluştu' }, { status: 500 });
  }
}
