'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { format } from 'date-fns';
import { differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Edit } from 'lucide-react';

import { PublicHolidayDialog } from './PublicHolidayDialog';
import { PublicHolidayListSkeleton } from './PublicHolidayListSkeleton';

import { usePublicHolidays } from '../queries/usePublicHoliday';
import { getPublicHolidayName } from '../utils/publicHolidayUtils';

export function PublicHolidayList() {
  const { data: holidays, isLoading } = usePublicHolidays();
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <PublicHolidayListSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resmi Tatiller</h2>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tatil Adı</TableHead>
              <TableHead>Başlangıç Tarihi</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPublicHolidayName(holiday.type)}
                    <Badge variant="outline">
                      {differenceInDays(new Date(holiday.endDate), new Date(holiday.startDate)) + 1} Gün Tatil
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(holiday.startDate), 'dd MMMM yyyy', {
                    locale: tr,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(holiday.endDate), 'dd MMMM yyyy', {
                    locale: tr,
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedHoliday(holiday);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedHoliday && <PublicHolidayDialog mode="edit" holiday={selectedHoliday} open={isDialogOpen} onOpenChange={setIsDialogOpen} />}
    </div>
  );
}
