import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import prisma from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = params;
    const { status, feedback } = await req.json();

    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (application.userId === session.user.id) {
      return NextResponse.json({ error: 'Kendi başvurunuzu onaylayamazsınız' }, { status: 403 });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status,
        feedback,
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

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: 'Başvuru bulunamadı' }, { status: 404 });
    }

    if (application.userId !== session.user.id) {
      return NextResponse.json({ error: 'Bu başvuruyu silme yetkiniz yok' }, { status: 403 });
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Başvuru başarıyla silindi' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    // Debug için session bilgilerini yazdıralım
    console.log('Session:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    // Önce başvuruyu ve dönem bilgisini birlikte alalım
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        period: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Başvuru bulunamadı' }, { status: 404 });
    }

    // Debug için başvuru bilgilerini yazdıralım
    console.log('Application:', {
      id: application.id,
      userId: application.userId,
      userEmail: application.user.email,
      status: application.status,
    });

    // Kullanıcı yetkisi kontrolü - ADMIN rolü veya başvuru sahibi olma durumu
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = application.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          error: 'Bu başvuruyu güncelleme yetkiniz yok',
          debug: {
            sessionUserId: session.user.id,
            applicationUserId: application.userId,
            isAdmin,
            isOwner,
          },
        },
        { status: 403 }
      );
    }

    // Başvuru durumunu kontrol edelim - Sadece başvuru sahibi için kontrol et
    if (!isAdmin && (application.status === 'APPROVED' || application.status === 'REJECTED')) {
      return NextResponse.json(
        {
          error: 'Onaylanmış veya reddedilmiş başvurular güncellenemez',
        },
        { status: 403 }
      );
    }

    // Tarihleri kontrol edelim
    const startDate = new Date(data.internshipStartDate);
    const endDate = new Date(data.internshipEndDate);
    const periodStartDate = new Date(application.period.internshipStartDate);
    const periodEndDate = new Date(application.period.internshipEndDate);

    if (startDate < periodStartDate || endDate > periodEndDate) {
      return NextResponse.json(
        {
          error: 'Staj tarihleri dönem tarihleri içinde olmalıdır',
          debug: {
            periodStart: periodStartDate,
            periodEnd: periodEndDate,
            requestedStart: startDate,
            requestedEnd: endDate,
          },
        },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...data,
        status: 'PENDING', // Güncellenen başvuru tekrar beklemede durumuna geçer
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

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Bir hata oluştu',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
