import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activeApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        status: 'APPROVED',
        internshipStartDate: {
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        internshipEndDate: {
          gte: today,
        },
      },
    });

    return NextResponse.json({
      isActive: !!activeApplication,
    });
  } catch (error) {
    console.error('Error checking active status:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
