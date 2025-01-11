'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import InternshipPeriodsTableSkeleton from '@/features/internship-periods/components/InternshipPeriodsTableSkeleton';
import { PeriodDialog } from '@/features/internship-periods/components/PeriodDialog';
import { useDeleteInternshipPeriod, useInternshipPeriods } from '@/features/internship-periods/queries/useInternshipPeriod';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

export default function InternshipPeriodsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const { data: periods, isLoading } = useInternshipPeriods();
  const deletePeriod = useDeleteInternshipPeriod();

  const handleEdit = (period) => {
    const formattedPeriod = {
      ...period,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
      internshipStartDate: new Date(period.internshipStartDate),
      internshipEndDate: new Date(period.internshipEndDate),
    };
    setSelectedPeriod(formattedPeriod);
    setEditDialogOpen(true);
  };

  const handleDelete = (period) => {
    setSelectedPeriod(period);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await deletePeriod.mutateAsync(selectedPeriod.id);
    setDeleteDialogOpen(false);
    setSelectedPeriod(null);
  };

  if (isLoading) {
    return <InternshipPeriodsTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staj Dönemleri</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>Yeni Dönem Ekle</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dönem Adı</TableHead>
              <TableHead>Başvuru Başlangıç</TableHead>
              <TableHead>Başvuru Bitiş</TableHead>
              <TableHead>Staj Başlangıç</TableHead>
              <TableHead>Staj Bitiş</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!periods?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Henüz hiç staj dönemi bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              periods?.map((period) => (
                <TableRow key={period.id}>
                  <TableCell>{period.name}</TableCell>
                  <TableCell>
                    {format(new Date(period.startDate), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(period.endDate), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(period.internshipStartDate), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(period.internshipEndDate), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(period)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(period)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PeriodDialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            setSelectedPeriod(null);
          }
        }}
        period={selectedPeriod}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emin misiniz?</DialogTitle>
            <DialogDescription>Bu işlem geri alınamaz. Bu staj dönemini silmek istediğinizden emin misiniz?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletePeriod.isLoading}>
              {deletePeriod.isLoading ? 'Siliniyor...' : 'Sil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
