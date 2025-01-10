// features/student-activities/components/StudentActivitiesSkeleton.jsx
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StudentActivitiesSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-8 w-[500px] text-2xl font-bold" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-64" /> <Skeleton className="h-10 w-full sm:w-[180px]" />{' '}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 w-full sm:w-[140px]" /> <Skeleton className="h-10 w-full sm:w-[140px]" />{' '}
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Tarih</TableHead>
              <TableHead className="w-[200px]">Öğrenci</TableHead>
              <TableHead>İçerik</TableHead>
              <TableHead className="w-[120px]">Durum</TableHead>
              <TableHead className="w-[200px]">Geri Bildirim</TableHead>
              <TableHead className="w-[80px]">Detay</TableHead>
              <TableHead className="w-[80px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center text-sm text-muted-foreground sm:text-left">
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-10 w-full sm:w-[140px]" />
        </div>
      </div>
    </div>
  );
};

export { StudentActivitiesSkeleton };
