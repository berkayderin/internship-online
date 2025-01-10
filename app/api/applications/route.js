// app/api/applications/route.js
import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import applicationSchema from '@/features/applications/zod/ApplicationSchema';

import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: {
        AND: [
          {
            periodId: { not: undefined },
          },
          session.user.role === 'ADMIN' ? {} : { userId: session.user.id },
        ],
      },
      include: {
        period: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const data = await req.json();
    const validationResult = applicationSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const startDate = new Date(data.internshipStartDate);
    const endDate = new Date(data.internshipEndDate);

    const application = await prisma.application.create({
      data: {
        ...data,
        userId: session.user.id,
        internshipStartDate: startDate,
        internshipEndDate: endDate,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
          },
        },
        period: true,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Bir hata oluştu', details: error.message }, { status: 500 });
  }
}
