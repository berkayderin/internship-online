import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = params;

    // Yöneticinin varlığını kontrol et
    const existingAdmin = await prisma.user.findUnique({
      where: {
        id,
        role: 'ADMIN',
      },
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Yönetici bulunamadı' }, { status: 404 });
    }

    const admin = await prisma.user.update({
      where: {
        id,
        role: 'ADMIN',
      },
      data: {
        firstName: body.firstName?.trim(),
        lastName: body.lastName?.trim(),
        department: body.department,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Yöneticinin varlığını kontrol et
    const existingAdmin = await prisma.user.findUnique({
      where: {
        id,
        role: 'ADMIN',
      },
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Yönetici bulunamadı' }, { status: 404 });
    }

    // Kendini silmeye çalışıyor mu kontrol et
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Kendinizi silemezsiniz' }, { status: 400 });
    }

    await prisma.user.delete({
      where: {
        id,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({
      message: 'Yönetici başarıyla silindi',
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
