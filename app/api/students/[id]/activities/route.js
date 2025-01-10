import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Filtreleme koşullarını oluştur
    const where = {
      userId: id,
      ...(status && status !== 'all' && { status }),
      ...(search && {
        content: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    // Toplam kayıt sayısını al
    const total = await prisma.dailyActivity.count({ where });

    // Aktiviteleri getir
    const activities = await prisma.dailyActivity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching student activities:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
