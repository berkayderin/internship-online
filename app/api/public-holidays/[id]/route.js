import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import publicHolidaySchema from '@/features/public-holidays/zod/PublicHolidaySchema';

import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();
    const validationResult = publicHolidaySchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const holiday = await prisma.publicHoliday.update({
      where: { id },
      data: {
        startDate: validationResult.data.startDate,
        endDate: validationResult.data.endDate,
      },
    });

    return NextResponse.json(holiday);
  } catch (error) {
    console.error('Error updating public holiday:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
