// app/api/internship-periods/route.js
import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import internshipPeriodSchema from '@/features/internship-periods/zod/InternshipPeriodSchema';

import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const validationResult = internshipPeriodSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const period = await prisma.internshipPeriod.create({
      data: validationResult.data,
    });

    return NextResponse.json(period);
  } catch (error) {
    console.error('Error creating internship period:', error);
    return NextResponse.json({ error: 'Bir hata oluştu', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const periods = await prisma.internshipPeriod.findMany({
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(periods);
  } catch (error) {
    console.error('Error fetching internship periods:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
