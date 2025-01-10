'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { CountdownTimer } from '@/components/main/CountdownTimer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { ApplicationDialog } from '@/features/applications/components/ApplicationDialog';
import { useApplications } from '@/features/applications/queries/useApplication';
import { PeriodDialog } from '@/features/internship-periods/components/PeriodDialog';
import { useInternshipPeriods } from '@/features/internship-periods/queries/useInternshipPeriod';
import { ApplicationStats } from '@/features/panel/components/ApplicationStats';
import { StudentStats } from '@/features/panel/components/StudentStats';

import { PlusIcon } from 'lucide-react';

const statusText = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
};

const statusVariants = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

export default function PanelPage() {
  const { data: session } = useSession();
  const [createPeriodOpen, setCreatePeriodOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);

  const { data: periods } = useInternshipPeriods();
  const { data: applications } = useApplications();

  const isAdmin = session?.user?.role === 'ADMIN';

  const handleApplyClick = (periodId) => {
    setSelectedPeriodId(periodId);
    setApplicationOpen(true);
  };

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col items-start justify-start gap-4">
        <h1 className="text-2xl font-semibold">
          Hoş Geldiniz, {session?.user?.firstName} {session?.user?.lastName}
        </h1>
        {isAdmin && (
          <Button onClick={() => setCreatePeriodOpen(true)} size="sm">
            <span className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Yeni Staj Dönemi Oluştur
            </span>
          </Button>
        )}
      </div>

      {isAdmin && (
        <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <ApplicationStats />
          <StudentStats />
        </div>
      )}

      {!isAdmin && periods?.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {periods.map((period) => (
            <div key={period.id} className="rounded-xl border border-gray-200 bg-white p-6 dark:bg-gray-800">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Dönem Adı:</span>
                  <p className="text-lg font-medium">{period.name}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Başvuru Tarihleri:</span>
                  <p className="text-lg font-medium">
                    {new Date(period.startDate).toLocaleDateString('tr-TR')} - {new Date(period.endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Staj Tarihleri:</span>
                  <p className="text-lg font-medium">
                    {new Date(period.internshipStartDate).toLocaleDateString('tr-TR')} -{' '}
                    {new Date(period.internshipEndDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                {new Date() < new Date(period.startDate) ? (
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <CountdownTimer targetDate={new Date(period.startDate)} />
                    <Button className="mt-4 w-full" disabled>
                      Başvurular Henüz Başlamadı
                    </Button>
                  </div>
                ) : new Date() > new Date(period.endDate) ? (
                  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                    <p className="text-center text-red-600 dark:text-red-400">Başvuru dönemi sona erdi</p>
                    <Button className="mt-4 w-full" disabled>
                      Başvurular Kapandı
                    </Button>
                  </div>
                ) : (
                  <div>
                    {applications?.find((app) => app.periodId === period.id) ? (
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Başvuru Durumu:</span>
                          <Badge variant={statusVariants[applications.find((app) => app.periodId === period.id).status]}>
                            {statusText[applications.find((app) => app.periodId === period.id).status]}
                          </Badge>
                        </div>

                        {applications.find((app) => app.periodId === period.id).feedback && (
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="mb-2 font-medium dark:text-gray-200">Geri Bildirim:</p>
                            <p className="italic text-gray-600 dark:text-gray-400">
                              {applications.find((app) => app.periodId === period.id).feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => handleApplyClick(period.id)} className="mt-4 w-full">
                        Staja Başvur
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAdmin && periods?.length === 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 dark:bg-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">Başvurulacak staj dönemi bulunmamaktadır.</p>
        </div>
      )}

      <PeriodDialog open={createPeriodOpen} onOpenChange={setCreatePeriodOpen} />

      <ApplicationDialog open={applicationOpen} onOpenChange={setApplicationOpen} periodId={selectedPeriodId} />
    </div>
  );
}
