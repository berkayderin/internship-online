import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityIds, status, feedback } = await req.json();
    const studentId = params.id;

    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      return NextResponse.json({ error: "Aktivite ID'leri gerekli" }, { status: 400 });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 });
    }

    await prisma.dailyActivity.updateMany({
      where: {
        id: {
          in: activityIds,
        },
        userId: studentId,
        status: 'PENDING',
      },
      data: {
        status,
        feedback: feedback || '',
        adminId: session.user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Aktiviteler başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating activities:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
