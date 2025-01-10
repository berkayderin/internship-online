import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import prisma from '@/lib/prisma';

export async function PATCH(req) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { ids, status, feedback } = await req.json();

    const applications = await prisma.application.findMany({
      where: {
        id: { in: ids },
        userId: session.user.id,
      },
    });

    if (applications.length > 0) {
      return NextResponse.json({ error: 'Kendi başvurularınızı onaylayamazsınız' }, { status: 403 });
    }

    const updatedApplications = await prisma.$transaction(
      ids.map((id) =>
        prisma.application.update({
          where: { id },
          data: { status, feedback },
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
        })
      )
    );

    return NextResponse.json(updatedApplications);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
